import { FormEvent, useMemo, useState } from "react";
import { ZaruMark } from "../components/ZaruMark";
import {
  CheckStatus,
  ChecklistItem,
  PropertyRecord,
  StageId,
  checklist,
  initialProperties,
  officialSources,
  stageMeta,
} from "./data";
import "./prototype.css";

type Screen = "home" | "property" | "checklist" | "compare" | "guide";

const stageOrder: StageId[] = ["remote", "visit", "contract"];
const money = (value: number) => `${value.toLocaleString("ko-KR")}만`;

const statusMeta: Record<CheckStatus, { label: string; symbol: string }> = {
  good: { label: "괜찮음", symbol: "✓" },
  caution: { label: "주의", symbol: "!" },
  unknown: { label: "미확인", symbol: "?" },
};

function itemsFor(stage: StageId) {
  return checklist.filter((item) => item.stage === stage);
}

function stageStats(property: PropertyRecord, stage: StageId) {
  const items = itemsFor(stage);
  const records = items.map((item) => property.checks[item.id]).filter(Boolean);
  return {
    total: items.length,
    recorded: records.length,
    good: records.filter((record) => record.status === "good").length,
    caution: records.filter((record) => record.status === "caution").length,
    unknown: records.filter((record) => record.status === "unknown").length,
  };
}

function totalStats(property: PropertyRecord) {
  const records = Object.values(property.checks);
  return {
    total: checklist.length,
    recorded: records.length,
    good: records.filter((record) => record.status === "good").length,
    caution: records.filter((record) => record.status === "caution").length,
    unknown: records.filter((record) => record.status === "unknown").length,
  };
}

export function PrototypeApp() {
  const [screen, setScreen] = useState<Screen>("home");
  const [properties, setProperties] = useState<PropertyRecord[]>(initialProperties);
  const [activePropertyId, setActivePropertyId] = useState(initialProperties[0].id);
  const [activeStage, setActiveStage] = useState<StageId>("remote");
  const [compareIds, setCompareIds] = useState<string[]>([initialProperties[0].id, initialProperties[1].id]);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [toast, setToast] = useState("");

  const activeProperty = properties.find((property) => property.id === activePropertyId) ?? properties[0];
  const compared = properties.filter((property) => compareIds.includes(property.id));

  const navigate = (next: Screen) => {
    setScreen(next);
    setExpandedItem(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProperty = (id: string) => {
    setActivePropertyId(id);
    navigate("property");
  };

  const openStage = (stage: StageId) => {
    setActiveStage(stage);
    navigate("checklist");
  };

  const updateCheck = (itemId: string, status: CheckStatus) => {
    setProperties((current) =>
      current.map((property) =>
        property.id !== activePropertyId
          ? property
          : {
              ...property,
              checks: {
                ...property.checks,
                [itemId]: { status, note: property.checks[itemId]?.note ?? "" },
              },
            }
      )
    );
  };

  const updateNote = (itemId: string, note: string) => {
    setProperties((current) =>
      current.map((property) =>
        property.id !== activePropertyId
          ? property
          : {
              ...property,
              checks: {
                ...property.checks,
                [itemId]: {
                  status: property.checks[itemId]?.status ?? "unknown",
                  note,
                },
              },
            }
      )
    );
  };

  const toggleCompare = (id: string) => {
    setCompareIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) {
        setToast("매물은 최대 3개까지 비교할 수 있어요.");
        window.setTimeout(() => setToast(""), 2200);
        return current;
      }
      return [...current, id];
    });
  };

  const addProperty = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const id = `property-${Date.now()}`;
    const property: PropertyRecord = {
      id,
      name: String(form.get("name") || "새 매물"),
      address: String(form.get("address") || "주소 미입력"),
      deposit: Number(form.get("deposit") || 0),
      rent: Number(form.get("rent") || 0),
      maintenance: Number(form.get("maintenance") || 0),
      floor: String(form.get("floor") || "확인 전"),
      moveIn: String(form.get("moveIn") || "확인 전"),
      source: String(form.get("source") || "직접 입력"),
      memo: "",
      accent: "blue",
      checks: {},
    };
    setProperties((current) => [...current, property]);
    setActivePropertyId(id);
    setShowAdd(false);
    setScreen("property");
  };

  return (
    <div className="proto-app">
      <ProtoHeader
        screen={screen}
        property={activeProperty}
        onBack={() => navigate(screen === "checklist" ? "property" : "home")}
        onHome={() => navigate("home")}
      />

      {screen === "home" && (
        <HomeScreen
          properties={properties}
          compareIds={compareIds}
          onAdd={() => setShowAdd(true)}
          onOpen={openProperty}
          onToggleCompare={toggleCompare}
          onCompare={() => navigate("compare")}
        />
      )}

      {screen === "property" && activeProperty && (
        <PropertyScreen
          property={activeProperty}
          onOpenStage={openStage}
          onCompare={() => {
            if (!compareIds.includes(activeProperty.id)) toggleCompare(activeProperty.id);
            navigate("compare");
          }}
        />
      )}

      {screen === "checklist" && activeProperty && (
        <ChecklistScreen
          property={activeProperty}
          stage={activeStage}
          expandedItem={expandedItem}
          onExpand={(id) => setExpandedItem((current) => (current === id ? null : id))}
          onStatus={updateCheck}
          onNote={updateNote}
          onStage={(stage) => {
            setActiveStage(stage);
            setExpandedItem(null);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onDone={() => navigate("property")}
        />
      )}

      {screen === "compare" && (
        <CompareScreen
          properties={properties}
          selected={compared}
          compareIds={compareIds}
          onToggle={toggleCompare}
          onOpen={openProperty}
        />
      )}

      {screen === "guide" && <GuideScreen onStart={() => navigate("home")} />}

      <BottomNav screen={screen} onNavigate={navigate} />

      {showAdd && <AddPropertySheet onClose={() => setShowAdd(false)} onSubmit={addProperty} />}
      {toast && <div className="proto-toast" role="status">{toast}</div>}
    </div>
  );
}

function ProtoHeader({
  screen,
  property,
  onBack,
  onHome,
}: {
  screen: Screen;
  property?: PropertyRecord;
  onBack: () => void;
  onHome: () => void;
}) {
  const nested = screen === "property" || screen === "checklist";
  return (
    <header className="proto-header">
      <div className="proto-header__inner">
        {nested ? (
          <button className="proto-icon-button" type="button" onClick={onBack} aria-label="이전 화면">←</button>
        ) : (
          <button className="proto-logo" type="button" onClick={onHome}>
            <ZaruMark size={25} /> <b>자취선배</b>
          </button>
        )}
        <div className="proto-header__title">
          {screen === "property" && <><small>매물 상세</small><b>{property?.name}</b></>}
          {screen === "checklist" && <><small>{stageMeta[("remote" as StageId)].step}–3 체크</small><b>{property?.name}</b></>}
          {screen === "compare" && <b>매물 비교</b>}
          {screen === "guide" && <b>체크 가이드</b>}
          {screen === "home" && <span>ROOM CHECK PROTOTYPE</span>}
        </div>
        <button className="proto-avatar" type="button" aria-label="내 프로필">YC</button>
      </div>
    </header>
  );
}

function HomeScreen({
  properties,
  compareIds,
  onAdd,
  onOpen,
  onToggleCompare,
  onCompare,
}: {
  properties: PropertyRecord[];
  compareIds: string[];
  onAdd: () => void;
  onOpen: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onCompare: () => void;
}) {
  const totalRecorded = properties.reduce((sum, property) => sum + totalStats(property).recorded, 0);
  return (
    <main className="proto-main proto-home">
      <section className="proto-home__hero">
        <div>
          <p className="proto-kicker">MY ROOM SHORTLIST</p>
          <h1>느낌은 짧게,<br /><strong>기록은 매물마다.</strong></h1>
          <p>가기 전부터 계약 직전까지 같은 기준으로 확인하고, 마지막에는 나란히 비교하세요.</p>
        </div>
        <div className="proto-home__summary">
          <span><b>{properties.length}</b>개 매물</span>
          <span><b>{totalRecorded}</b>개 기록</span>
          <span><b>{compareIds.length}</b>개 비교 중</span>
        </div>
      </section>

      <section className="proto-flow" aria-label="집 확인 3단계">
        {stageOrder.map((stage, index) => (
          <article key={stage}>
            <span>0{index + 1}</span>
            <div><small>{stageMeta[stage].short}</small><b>{stageMeta[stage].title}</b></div>
            {index < 2 && <i>→</i>}
          </article>
        ))}
      </section>

      <section className="proto-properties">
        <div className="proto-section-head">
          <div><p className="proto-kicker">저장한 매물</p><h2>어느 집부터 확인할까요?</h2></div>
          <button className="proto-primary" type="button" onClick={onAdd}>＋ 새 매물 추가</button>
        </div>
        <div className="proto-property-grid">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              selected={compareIds.includes(property.id)}
              onOpen={() => onOpen(property.id)}
              onToggle={() => onToggleCompare(property.id)}
            />
          ))}
          <button className="proto-add-card" type="button" onClick={onAdd}>
            <span>＋</span><b>새 매물 기록 시작</b><small>주소와 가격만 입력해도 돼요</small>
          </button>
        </div>
      </section>

      {compareIds.length > 0 && (
        <div className="proto-compare-bar">
          <div className="proto-compare-stack">
            {properties.filter((property) => compareIds.includes(property.id)).map((property) => (
              <span key={property.id} className={`is-${property.accent}`}>{property.name.slice(0, 1)}</span>
            ))}
          </div>
          <p><b>{compareIds.length}개 매물 선택</b><span>최대 3개까지 나란히 볼 수 있어요.</span></p>
          <button type="button" onClick={onCompare}>비교하기 →</button>
        </div>
      )}
    </main>
  );
}

function PropertyCard({ property, selected, onOpen, onToggle }: { property: PropertyRecord; selected: boolean; onOpen: () => void; onToggle: () => void }) {
  const stats = totalStats(property);
  const percent = Math.round((stats.recorded / stats.total) * 100);
  return (
    <article className={`proto-property-card is-${property.accent}`}>
      <div className="proto-property-card__top">
        <span>{property.source}</span>
        <button className={selected ? "is-selected" : ""} type="button" onClick={onToggle} aria-pressed={selected}>
          {selected ? "✓ 비교 중" : "＋ 비교"}
        </button>
      </div>
      <button className="proto-property-card__body" type="button" onClick={onOpen}>
        <div className="proto-property-visual"><span>{property.floor}</span><b>{property.name.slice(0, 1)}</b></div>
        <div className="proto-property-copy">
          <small>{property.address}</small>
          <h3>{property.name}</h3>
          <p>보증금 {money(property.deposit)} · 월 {property.rent}만 · 관리 {property.maintenance}만</p>
        </div>
        <div className="proto-property-progress">
          <div><span style={{ width: `${percent}%` }} /></div>
          <b>{stats.recorded}/{stats.total}</b>
        </div>
        <div className="proto-property-alerts">
          <span className="is-caution">주의 {stats.caution}</span>
          <span className="is-unknown">미확인 {stats.unknown}</span>
          <i>상세 보기 →</i>
        </div>
      </button>
    </article>
  );
}

function PropertyScreen({ property, onOpenStage, onCompare }: { property: PropertyRecord; onOpenStage: (stage: StageId) => void; onCompare: () => void }) {
  const stats = totalStats(property);
  return (
    <main className="proto-main proto-detail">
      <section className={`proto-detail-hero is-${property.accent}`}>
        <div className="proto-detail-hero__visual"><span>{property.source}</span><b>{property.name.slice(0, 1)}</b><small>{property.floor}</small></div>
        <div className="proto-detail-hero__copy">
          <p>{property.address}</p>
          <h1>{property.name}</h1>
          <div className="proto-price-row">
            <span><small>보증금</small><b>{money(property.deposit)}원</b></span>
            <span><small>월세</small><b>{property.rent}만 원</b></span>
            <span><small>관리비</small><b>{property.maintenance}만 원</b></span>
            <span><small>입주</small><b>{property.moveIn}</b></span>
          </div>
          <p className="proto-detail-memo">“{property.memo || "아직 한 줄 메모가 없어요."}”</p>
        </div>
        <button type="button" onClick={onCompare}>＋ 비교에 담기</button>
      </section>

      <section className="proto-detail-summary">
        <div className="proto-score-card">
          <div className="proto-score-ring" style={{ "--progress": `${(stats.recorded / stats.total) * 360}deg` } as React.CSSProperties}>
            <strong>{Math.round((stats.recorded / stats.total) * 100)}</strong><span>%</span>
          </div>
          <div><small>전체 기록률</small><b>{stats.recorded}개 확인 · {stats.total - stats.recorded}개 남음</b><p>주의 {stats.caution}개 · 미확인 {stats.unknown}개</p></div>
        </div>
        <div className="proto-next-card">
          <span>다음 추천</span>
          <b>{stats.recorded === 0 ? "온라인 정보부터 확인하세요" : "주의 항목의 답변을 메모하세요"}</b>
          <p>답변을 기록하면 다른 매물과 비교할 때 바로 보여요.</p>
        </div>
      </section>

      <section className="proto-stage-section">
        <div className="proto-section-head"><div><p className="proto-kicker">CHECK FLOW</p><h2>3단계로 놓치지 않게</h2></div></div>
        <div className="proto-stage-list">
          {stageOrder.map((stage, index) => {
            const current = stageStats(property, stage);
            const percent = Math.round((current.recorded / current.total) * 100);
            return (
              <button type="button" key={stage} onClick={() => onOpenStage(stage)}>
                <span className="proto-stage-number">0{index + 1}</span>
                <div className="proto-stage-copy"><small>{stageMeta[stage].step} · {stageMeta[stage].short}</small><b>{stageMeta[stage].title}</b><p>{stageMeta[stage].description}</p></div>
                <div className="proto-stage-status">
                  <strong>{percent}%</strong>
                  <div><span style={{ width: `${percent}%` }} /></div>
                  <small>주의 {current.caution} · 미확인 {current.unknown}</small>
                </div>
                <i>→</i>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
}

function ChecklistScreen({
  property,
  stage,
  expandedItem,
  onExpand,
  onStatus,
  onNote,
  onStage,
  onDone,
}: {
  property: PropertyRecord;
  stage: StageId;
  expandedItem: string | null;
  onExpand: (id: string) => void;
  onStatus: (id: string, status: CheckStatus) => void;
  onNote: (id: string, note: string) => void;
  onStage: (stage: StageId) => void;
  onDone: () => void;
}) {
  const items = itemsFor(stage);
  const stats = stageStats(property, stage);
  const grouped = useMemo(() => {
    return items.reduce<Record<string, ChecklistItem[]>>((result, item) => {
      (result[item.category] ||= []).push(item);
      return result;
    }, {});
  }, [items]);
  const percent = Math.round((stats.recorded / stats.total) * 100);

  return (
    <main className="proto-main proto-checklist-screen">
      <section className="proto-checklist-head">
        <div>
          <p className="proto-kicker">{stageMeta[stage].step} · {stageMeta[stage].short}</p>
          <h1>{stageMeta[stage].title}</h1>
          <p>{stageMeta[stage].description}</p>
        </div>
        <div className="proto-check-progress">
          <strong>{percent}%</strong>
          <div><span style={{ width: `${percent}%` }} /></div>
          <p>{stats.recorded}/{stats.total} 기록 · 주의 {stats.caution} · 미확인 {stats.unknown}</p>
        </div>
      </section>

      <nav className="proto-stage-tabs" aria-label="체크 단계">
        {stageOrder.map((item, index) => (
          <button type="button" key={item} className={stage === item ? "is-active" : ""} onClick={() => onStage(item)}>
            <span>0{index + 1}</span><b>{stageMeta[item].short}</b><small>{stageStats(property, item).recorded}/{stageStats(property, item).total}</small>
          </button>
        ))}
      </nav>

      <div className="proto-check-layout">
        <aside>
          <p>빠른 이동</p>
          {Object.keys(grouped).map((category) => <a key={category} href={`#${stage}-${category}`}>{category}</a>)}
          <div><b>기록 방법</b><span><i className="is-good" /> 괜찮음</span><span><i className="is-caution" /> 주의 필요</span><span><i className="is-unknown" /> 아직 미확인</span></div>
        </aside>

        <section className="proto-check-groups">
          {Object.entries(grouped).map(([category, categoryItems]) => (
            <div className="proto-check-group" id={`${stage}-${category}`} key={category}>
              <div className="proto-check-group__head"><h2>{category}</h2><span>{categoryItems.filter((item) => property.checks[item.id]).length}/{categoryItems.length}</span></div>
              {categoryItems.map((item) => (
                <CheckItemCard
                  key={item.id}
                  item={item}
                  record={property.checks[item.id]}
                  expanded={expandedItem === item.id}
                  onExpand={() => onExpand(item.id)}
                  onStatus={(status) => onStatus(item.id, status)}
                  onNote={(note) => onNote(item.id, note)}
                />
              ))}
            </div>
          ))}
        </section>
      </div>

      <div className="proto-check-done">
        <p><b>{stageMeta[stage].title}</b><span>{stats.recorded}/{stats.total}개 기록했어요.</span></p>
        <button type="button" onClick={onDone}>매물 상세로 돌아가기</button>
      </div>
    </main>
  );
}

function CheckItemCard({ item, record, expanded, onExpand, onStatus, onNote }: {
  item: ChecklistItem;
  record?: { status: CheckStatus; note: string };
  expanded: boolean;
  onExpand: () => void;
  onStatus: (status: CheckStatus) => void;
  onNote: (note: string) => void;
}) {
  return (
    <article className={`proto-check-item${record ? ` is-${record.status}` : ""}`}>
      <div className="proto-check-item__main">
        <button className="proto-check-item__expand" type="button" onClick={onExpand} aria-expanded={expanded}>
          <span>{record ? statusMeta[record.status].symbol : "·"}</span>
          <div>{item.critical && <small>중요</small>}<b>{item.title}</b><p>{item.help}</p></div>
        </button>
        <div className="proto-status-buttons" aria-label={`${item.title} 상태`}>
          {(Object.keys(statusMeta) as CheckStatus[]).map((status) => (
            <button type="button" key={status} className={record?.status === status ? "is-active" : ""} onClick={() => onStatus(status)}>
              <span>{statusMeta[status].symbol}</span>{statusMeta[status].label}
            </button>
          ))}
        </div>
      </div>
      {expanded && (
        <div className="proto-check-item__note">
          <label htmlFor={`note-${item.id}`}>내 기록</label>
          <textarea id={`note-${item.id}`} value={record?.note ?? ""} onChange={(event) => onNote(event.target.value)} placeholder="중개사의 답변, 본 것, 다시 물어볼 내용을 적어두세요." />
          <span>메모를 입력하면 상태가 ‘미확인’으로 자동 기록돼요.</span>
        </div>
      )}
    </article>
  );
}

function CompareScreen({ properties, selected, compareIds, onToggle, onOpen }: {
  properties: PropertyRecord[];
  selected: PropertyRecord[];
  compareIds: string[];
  onToggle: (id: string) => void;
  onOpen: (id: string) => void;
}) {
  const riskItems = checklist.filter((item) => selected.some((property) => {
    const status = property.checks[item.id]?.status;
    return status === "caution" || status === "unknown";
  })).slice(0, 8);
  return (
    <main className="proto-main proto-compare">
      <section className="proto-compare-head">
        <div><p className="proto-kicker">SIDE BY SIDE</p><h1>월세보다 중요한 차이를<br />한눈에 비교하세요.</h1></div>
        <p>최대 3개 매물의 가격, 진행률, 주의 기록을 같은 기준으로 봅니다.</p>
      </section>

      <section className="proto-compare-picker">
        <p>비교할 매물 선택 <span>{compareIds.length}/3</span></p>
        <div>{properties.map((property) => (
          <button type="button" key={property.id} className={compareIds.includes(property.id) ? "is-selected" : ""} onClick={() => onToggle(property.id)}>
            <i className={`is-${property.accent}`}>{property.name.slice(0, 1)}</i><span><b>{property.name}</b><small>월 {property.rent}만 원</small></span><em>{compareIds.includes(property.id) ? "✓" : "+"}</em>
          </button>
        ))}</div>
      </section>

      {selected.length < 2 ? (
        <div className="proto-empty"><span>↔</span><h2>비교할 매물을 2개 이상 선택하세요.</h2><p>기록이 적어도 가격과 기본 조건부터 비교할 수 있어요.</p></div>
      ) : (
        <>
          <section className="proto-compare-table-wrap">
            <table className="proto-compare-table">
              <thead><tr><th>비교 항목</th>{selected.map((property) => <th key={property.id}><button type="button" onClick={() => onOpen(property.id)}><i className={`is-${property.accent}`}>{property.name.slice(0, 1)}</i><b>{property.name}</b><span>상세 보기 →</span></button></th>)}</tr></thead>
              <tbody>
                <CompareRow label="보증금" properties={selected} render={(property) => `${money(property.deposit)}원`} />
                <CompareRow label="월세" properties={selected} render={(property) => `${property.rent}만 원`} best={(property) => property.rent === Math.min(...selected.map((item) => item.rent))} />
                <CompareRow label="관리비" properties={selected} render={(property) => `${property.maintenance}만 원`} best={(property) => property.maintenance === Math.min(...selected.map((item) => item.maintenance))} />
                <CompareRow label="월 고정비" properties={selected} render={(property) => `${property.rent + property.maintenance}만 원`} best={(property) => property.rent + property.maintenance === Math.min(...selected.map((item) => item.rent + item.maintenance))} />
                <CompareRow label="층수" properties={selected} render={(property) => property.floor} />
                <CompareRow label="입주 가능" properties={selected} render={(property) => property.moveIn} />
                <CompareRow label="전체 기록" properties={selected} render={(property) => `${totalStats(property).recorded}/${totalStats(property).total}`} />
                <CompareRow label="주의·미확인" properties={selected} render={(property) => `${totalStats(property).caution + totalStats(property).unknown}개`} danger={(property) => totalStats(property).caution + totalStats(property).unknown > 3} />
              </tbody>
            </table>
          </section>

          <MobileCompareList properties={selected} onOpen={onOpen} />

          <section className="proto-risk-compare">
            <div className="proto-section-head"><div><p className="proto-kicker">RISK NOTES</p><h2>주의·미확인 항목만 모아보기</h2></div></div>
            <div className="proto-risk-grid">
              {riskItems.map((item) => (
                <article key={item.id}>
                  <div><small>{stageMeta[item.stage].short} · {item.category}</small><b>{item.title}</b></div>
                  <div>{selected.map((property) => {
                    const record = property.checks[item.id];
                    return <span key={property.id} className={record ? `is-${record.status}` : "is-empty"}><i>{property.name.slice(0, 1)}</i><b>{record ? statusMeta[record.status].label : "기록 없음"}</b>{record?.note && <small>{record.note}</small>}</span>;
                  })}</div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}
    </main>
  );
}

function MobileCompareList({ properties, onOpen }: {
  properties: PropertyRecord[];
  onOpen: (id: string) => void;
}) {
  const rows: {
    label: string;
    render: (property: PropertyRecord) => string;
    best?: (property: PropertyRecord) => boolean;
    danger?: (property: PropertyRecord) => boolean;
  }[] = [
    { label: "보증금", render: (property) => `${money(property.deposit)}원` },
    {
      label: "월세",
      render: (property) => `${property.rent}만 원`,
      best: (property) => property.rent === Math.min(...properties.map((item) => item.rent)),
    },
    {
      label: "관리비",
      render: (property) => `${property.maintenance}만 원`,
      best: (property) => property.maintenance === Math.min(...properties.map((item) => item.maintenance)),
    },
    {
      label: "월 고정비",
      render: (property) => `${property.rent + property.maintenance}만 원`,
      best: (property) => property.rent + property.maintenance === Math.min(...properties.map((item) => item.rent + item.maintenance)),
    },
    { label: "층수", render: (property) => property.floor },
    { label: "입주 가능", render: (property) => property.moveIn },
    { label: "전체 기록", render: (property) => `${totalStats(property).recorded}/${totalStats(property).total}` },
    {
      label: "주의·미확인",
      render: (property) => `${totalStats(property).caution + totalStats(property).unknown}개`,
      danger: (property) => totalStats(property).caution + totalStats(property).unknown > 3,
    },
  ];

  return (
    <section className="proto-compare-mobile" aria-label="모바일 매물 비교">
      <div className="proto-compare-mobile__properties">
        {properties.map((property) => (
          <button type="button" key={property.id} onClick={() => onOpen(property.id)}>
            <i className={`is-${property.accent}`}>{property.name.slice(0, 1)}</i>
            <span><b>{property.name}</b><small>상세 보기 →</small></span>
          </button>
        ))}
      </div>

      <div className="proto-compare-mobile__rows">
        {rows.map((row) => (
          <article key={row.label}>
            <h2>{row.label}</h2>
            <div>
              {properties.map((property) => (
                <span
                  key={property.id}
                  className={row.best?.(property) ? "is-best" : row.danger?.(property) ? "is-danger" : ""}
                >
                  <i className={`is-${property.accent}`}>{property.name.slice(0, 1)}</i>
                  <b>{row.render(property)}</b>
                  {row.best?.(property) && <small>가장 낮음</small>}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function CompareRow({ label, properties, render, best, danger }: {
  label: string;
  properties: PropertyRecord[];
  render: (property: PropertyRecord) => string;
  best?: (property: PropertyRecord) => boolean;
  danger?: (property: PropertyRecord) => boolean;
}) {
  return <tr><th>{label}</th>{properties.map((property) => <td key={property.id} className={best?.(property) ? "is-best" : danger?.(property) ? "is-danger" : ""}>{render(property)}{best?.(property) && <small>가장 낮음</small>}</td>)}</tr>;
}

function GuideScreen({ onStart }: { onStart: () => void }) {
  return (
    <main className="proto-main proto-guide">
      <section className="proto-guide-hero"><p className="proto-kicker">HOW IT WORKS</p><h1>좋은 집을 찾아주는 대신,<br />좋은 질문을 놓치지 않게.</h1><p>자취선배는 법적·기술적 판단을 대신하지 않습니다. 매물마다 같은 기준으로 질문하고, 공식 기관 확인이 필요한 순간을 알려줍니다.</p><button type="button" onClick={onStart}>내 매물 확인 시작하기</button></section>
      <section className="proto-guide-steps">{stageOrder.map((stage, index) => <article key={stage}><span>0{index + 1}</span><small>{stageMeta[stage].short}</small><h2>{stageMeta[stage].title}</h2><p>{stageMeta[stage].description}</p><b>{itemsFor(stage).length}개 체크 항목</b></article>)}</section>
      <section className="proto-guide-sources"><div><p className="proto-kicker">OFFICIAL SOURCES</p><h2>중요한 판단은 공식 기준으로 연결합니다.</h2></div><ul>{officialSources.map((source) => <li key={source.href}><a href={source.href} target="_blank" rel="noreferrer">{source.label}<span>↗</span></a></li>)}</ul></section>
      <p className="proto-legal-note">이 프로토타입의 체크 항목과 결과는 법률·보증·하자 판정을 확정하지 않습니다. 실제 계약 전에는 최신 공적 장부와 공식 기관, 필요한 경우 전문가를 통해 다시 확인하세요.</p>
    </main>
  );
}

function BottomNav({ screen, onNavigate }: { screen: Screen; onNavigate: (screen: Screen) => void }) {
  const roomActive = screen === "home" || screen === "property" || screen === "checklist";
  return (
    <nav className="proto-bottom-nav" aria-label="프로토타입 주요 메뉴">
      <button type="button" className={roomActive ? "is-active" : ""} aria-current={roomActive ? "page" : undefined} onClick={() => onNavigate("home")}><span>⌂</span><b>내 매물</b></button>
      <button type="button" className={screen === "compare" ? "is-active" : ""} aria-current={screen === "compare" ? "page" : undefined} onClick={() => onNavigate("compare")}><span>⇄</span><b>비교</b></button>
      <button type="button" className={screen === "guide" ? "is-active" : ""} aria-current={screen === "guide" ? "page" : undefined} onClick={() => onNavigate("guide")}><span>?</span><b>가이드</b></button>
    </nav>
  );
}

function AddPropertySheet({ onClose, onSubmit }: { onClose: () => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return (
    <div className="proto-sheet-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="proto-sheet" role="dialog" aria-modal="true" aria-labelledby="add-property-title">
        <div className="proto-sheet__head"><div><small>NEW PROPERTY</small><h2 id="add-property-title">새 매물 기록</h2></div><button type="button" onClick={onClose} aria-label="닫기">×</button></div>
        <form onSubmit={onSubmit}>
          <label><span>매물 이름</span><input name="name" required placeholder="예: 성수동 햇살 원룸" /></label>
          <label className="is-wide"><span>주소·동·호수</span><input name="address" required placeholder="정확한 주소는 나중에 수정해도 돼요" /></label>
          <div className="proto-form-grid"><label><span>보증금 (만원)</span><input name="deposit" type="number" min="0" placeholder="1000" /></label><label><span>월세 (만원)</span><input name="rent" type="number" min="0" placeholder="65" /></label><label><span>관리비 (만원)</span><input name="maintenance" type="number" min="0" placeholder="8" /></label></div>
          <div className="proto-form-grid proto-form-grid--two"><label><span>층수</span><input name="floor" placeholder="4층 / 4층" /></label><label><span>입주 가능일</span><input name="moveIn" placeholder="8월 18일" /></label></div>
          <label><span>발견한 곳</span><select name="source"><option>네이버부동산</option><option>직방</option><option>다방</option><option>공인중개사 추천</option><option>직접 입력</option></select></label>
          <div className="proto-sheet__actions"><button type="button" onClick={onClose}>취소</button><button type="submit">매물 추가하고 체크 시작</button></div>
        </form>
      </section>
    </div>
  );
}

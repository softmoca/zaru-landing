type VariantSwitchProps = {
  active: 1 | 2 | 3;
};

const variants = [
  { id: 1, label: "균형형" },
  { id: 2, label: "경고형" },
  { id: 3, label: "리포트형" },
] as const;

export function VariantSwitch({ active }: VariantSwitchProps) {
  return (
    <nav className="variant-switch" aria-label="랜딩페이지 시안 비교">
      <span>시안 비교</span>
      <div>
        {variants.map((variant) => (
          <a
            key={variant.id}
            className={active === variant.id ? "is-active" : ""}
            href={variant.id === 1 ? "?" : `?variant=${variant.id}`}
            aria-current={active === variant.id ? "page" : undefined}
          >
            <b>{variant.id}</b>
            {variant.label}
          </a>
        ))}
      </div>
    </nav>
  );
}

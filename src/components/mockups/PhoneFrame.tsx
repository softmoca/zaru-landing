import { MOCKUP_HEIGHT, MOCKUP_WIDTH, type Mockup } from "./mockups";

interface Props extends Mockup {
  /** 첫 화면에 바로 보이는 이미지만 true (히어로). 나머지는 스크롤해야 나오니 lazy. */
  priority?: boolean;
}

/** 앱 화면 목업의 껍데기. 안쪽은 실제 캡처 이미지다.
 *  width/height 를 명시해 이미지를 받기 전에도 자리를 잡아둔다(CLS 방지). */
export function PhoneFrame({ src, alt, priority = false }: Props) {
  return (
    <div className="phone">
      <div className="phone__notch" />
      <div className="phone__screen">
        <img
          className="phone__img"
          src={src}
          alt={alt}
          width={MOCKUP_WIDTH}
          height={MOCKUP_HEIGHT}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
        />
      </div>
    </div>
  );
}

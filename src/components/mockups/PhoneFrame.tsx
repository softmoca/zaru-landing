import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/** 앱 화면 목업의 껍데기.
 *
 *  ⚠️ 실제 프로토타입 이미지가 나오면 이 안쪽(.phone__screen 의 children)만
 *     <img src="..." alt="" /> 로 갈아끼우면 된다. 바깥 프레임/그림자는 그대로 쓴다. */
export function PhoneFrame({ children }: Props) {
  return (
    <div className="phone">
      <div className="phone__notch" />
      <div className="phone__screen">{children}</div>
    </div>
  );
}

import {FC, useCallback, useRef} from "react";
import classNames from './City.module.scss';
import {AppBuilder} from "@/modules/AppBuilder/AppBuilder";

const City: FC = () => {
  const app = useRef<AppBuilder>(new AppBuilder());

  const htmlRefHandler = useCallback((e: HTMLDivElement) => {
    if (app.current) {
      app.current?.setContainer(e);
    }
  }, [app]);

  return (
    <div>
      <div
        className={classNames.canvas}
        ref={htmlRefHandler}
      />
    </div>
  );
};

export default City;

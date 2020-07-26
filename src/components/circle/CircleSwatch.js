import React from "react";
import reactCSS, { handleHover } from "reactcss";

import { Swatch } from "../common";

export const CircleSwatch = ({
  color,
  onClick,
  onSwatchHover,
  hover,
  active,
  circleSize,
  circleSpacing,
}) => {
  const backgroundColor = color;

  const index = color.indexOf("#");
  const shadowColor = color.slice(index, index + 7);

  const styles = reactCSS(
    {
      default: {
        swatch: {
          width: circleSize,
          height: circleSize,
          marginRight: circleSpacing,
          marginBottom: circleSpacing,
          transform: "scale(1)",
          transition: "100ms transform ease",
        },
        Swatch: {
          borderRadius: "50%",
          backgroundImage: backgroundColor,
          backgroundPosition: "center",
          backgroundSize: "cover",
          // boxShadow: `inset 0 0 0 ${circleSize / 2 + 1}px ${shadowColor}`,
          transition: "100ms box-shadow ease",
        },
      },
      hover: {
        swatch: {
          transform: "scale(1.2)",
        },
      },
      active: {
        Swatch: {
          // boxShadow: `inset 0 0 0 5px ${shadowColor}`,
          // transform: "scale(1.2)",
          // borderRadius: `2px solid ${shadowColor}`,
        },
      },
    },
    { hover, active }
  );

  return (
    <div style={styles.swatch}>
      <Swatch
        style={styles.Swatch}
        color={color}
        onClick={onClick}
        onHover={onSwatchHover}
        // focusStyle={{
        //   boxShadow: `${shadowColor}, 0 0 5px ${shadowColor}`,
        // }}
      />
    </div>
  );
};

CircleSwatch.defaultProps = {
  circleSize: 28,
  circleSpacing: 14,
};

export default handleHover(CircleSwatch);

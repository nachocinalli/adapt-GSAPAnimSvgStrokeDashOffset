import React from 'react';

export default function GSAPAnimStrokeDashOffset({ _GSAPAnimSvgStrokeDashOffset }) {
  const { rawSVG, _classes } = _GSAPAnimSvgStrokeDashOffset;
  return <div className={`gsapanimstrokedashoffset-svg ${_classes} `} dangerouslySetInnerHTML={{ __html: rawSVG }} />;
}

import Adapt from 'core/js/adapt';
import device from 'core/js/device';
import React from 'react';
import ReactDOM from 'react-dom';
import { templates } from 'core/js/reactHelpers';
export default class GSAPAnimSvgStrokeDashOffsetView extends Backbone.View {
  className() {
    return [
      'gsapanimstrokedashoffset',
      `gsapanimstrokedashoffset-${this.model.get('_type')}`,
      `gsapanimstrokedashoffset-${this.model.get('_id')}`
    ].join(' ');
  }

  initialize() {
    this.listenTo(Adapt, 'device:changed', this.render);
    this.render();
  }

  async render() {
    const svgSrcs = this.model.get('_GSAPAnimSvgStrokeDashOffset').svgSrcs;
    const svgSrc = this.svgScreen(svgSrcs);

    if (!svgSrc) {
      return;
    }

    const rawSVG = await (await fetch(svgSrc.src)).text();

    if (!rawSVG) {
      return;
    }
    this.model.set('_GSAPAnimSvgStrokeDashOffset', {
      ...this.model.get('_GSAPAnimSvgStrokeDashOffset'),
      rawSVG,
      pathTo: svgSrc.pathTo,
      _classes: svgSrc._classes
    });
    const data = {
      ...this.model.attributes
    };
    ReactDOM.render(<templates.GSAPAnimSvgStrokeDashOffset {...data} />, this.el);
    _.defer(this.postRender.bind(this));
  }

  svgScreen(elem) {
    const screenSize = device.screenSize ?? 'small';
    return elem[`${screenSize}`];
  }

  postRender() {
    const svgSrcs = this.model.get('_GSAPAnimSvgStrokeDashOffset').svgSrcs;
    const svgSrc = this.svgScreen(svgSrcs);
    const percentageScreenHeight = svgSrc.percentageScreenHeight || 100;
    const startAt = svgSrc.startAt || 'top 50%';
    const showMarkers = this.model.get('_GSAPAnimSvgStrokeDashOffset').showMarkers || false;
    const paths = this.$el[0].querySelectorAll('path');
    const screenHeight = device.screenHeight;
    const percentageScreenHeightValue = (percentageScreenHeight / 100) * screenHeight;

    paths.forEach((el) => {
      const length = el.getTotalLength();
      el.style.strokeDasharray = length;
      el.style.strokeDashoffset = length;
      Adapt.GSAP.lib.set(el, {
        strokeDashoffset: length
      });

      Adapt.GSAP.ScrollTrigger.create({
        trigger: el,
        start: startAt,
        end: 'bottom bottom',
        markers: showMarkers,
        onUpdate: (self) => {
          const percentage = Math.round(self.progress * 100);
          let draw = (length * percentage) / 100;
          if (percentage > 0) {
            draw = draw + percentageScreenHeightValue;
          }

          Adapt.GSAP.lib.to(el, {
            strokeDashoffset: length - draw
          });
        }
      });
    });
  }
}

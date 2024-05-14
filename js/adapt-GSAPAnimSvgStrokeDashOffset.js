import Adapt from 'core/js/adapt';
import GSAPAnimSvgStrokeDashOffsetView from './GSAPAnimSvgStrokeDashOffsetView';

class GSAPAnimSvgStrokeDashOffset extends Backbone.Controller {
  initialize() {
    this.listenTo(Adapt, 'app:dataReady', this.onDataReady);
  }

  static get courseConfig() {
    return Adapt.course.get('_GSAPAnimSvgStrokeDashOffset');
  }

  isEnabled() {
    return !(!GSAPAnimSvgStrokeDashOffset.courseConfig || !GSAPAnimSvgStrokeDashOffset.courseConfig._isEnabled);
  }

  onDataReady() {
    if (!this.isEnabled()) {
      return;
    }

    this.listenTo(Adapt, 'GSAP:ready', this.setupUpEventListeners);
  }

  setupUpEventListeners() {
    const modelTypes = ['article', 'block', 'component'];

    const modelEventNames = modelTypes.concat(['']).join('View:postRender ');

    this.listenTo(Adapt, modelEventNames, this.renderSvgView);
  }

  renderSvgView(view) {
    const viewModel = view.model;
    const gsapAnimStrokeDashOffset = viewModel.get('_GSAPAnimSvgStrokeDashOffset');

    if (!gsapAnimStrokeDashOffset || !gsapAnimStrokeDashOffset._isEnabled) {
      return;
    }

    const $selector = view.$el.find(`${gsapAnimStrokeDashOffset.selector}`);
    this.svgView = new GSAPAnimSvgStrokeDashOffsetView({ model: viewModel });
    view.$el.addClass('has-gsapanimstrokedashoffset');

    if ($selector.length) {
      this.svgView.$el.insertBefore($selector);
    }
  }
}

export default new GSAPAnimSvgStrokeDashOffset();

import { inject as service } from '@ember/service';
import Component from '@ember/component';
import layout from './template';

export default Component.extend({
  layout,
  scope: service(),
  classNames: ['stack-app'],
  srcSet: false,

  actions: {
    toggle() {
      // this.sendAction('toggle');
    },
  },
  didRender() {
    if (!this.get('srcSet')) {
      this.set('srcSet', true);
      var $icon = this.$('.catalog-icon > img');
      $icon.attr('src', $icon.data('src'));
      this.$('img').on('error', () => {
        $icon.attr('src', `${this.get('app.baseAssets')}assets/images/generic-catalog.svg`);
      });
    }
  }
});

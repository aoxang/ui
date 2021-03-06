import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';
import Component from '@ember/component';
import C from 'ui/utils/constants';
import layout from './template';

export default Component.extend({
  layout,
  scope:             service(),
  session:           service(),

  model:             null,
  showStats:         false,
  bulkActions:       true,
  expandPlaceholder: false,
  scalePlaceholder:  false,
  cpuMax:            null,
  memoryMax:         null,
  storageMax:        null,
  networkMax:        null,
  showActions:       true,
  tagName:           '',
  expanded:          null,

  actions: {
    toggle() {
      this.sendAction('toggle');
    },
  },

  canExpand: computed('expandPlaceholder', 'model.containers', function() {
    return get(this,'expandPlaceholder') && Object.keys(get(this,'model.containers')).length > 1;
  }),

  statsAvailable: computed('model.{state,healthState}', function() {
    return C.ACTIVEISH_STATES.indexOf(this.get('model.state')) >= 0 && this.get('model.healthState') !== 'started-once';
  }),

  containers: computed('model.containers', function() {
    return Object.values(get(this,'model.containers'));
  }),
});

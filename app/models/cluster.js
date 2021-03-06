import { computed } from '@ember/object';
import { equal } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Resource from 'ember-api-store/models/resource';
import PolledResource from 'ui/mixins/cattle-polled-resource';
import { hasMany } from 'ember-api-store/utils/denormalize';

var Cluster = Resource.extend(PolledResource, {
  scope:        service(),
  router:       service(),

  namespaces: hasMany('id', 'namespace', 'clusterId'),
  projects: hasMany('id', 'project', 'clusterId'),

  canAddNode: true, // @TODO-2.0

  actions: {
    edit() {
      this.get('router').transitionTo('authenticated.cluster.edit', this.get('id'));
    },
  },

  isKubernetes: equal('orchestration','kubernetes'),

  delete: function(/*arguments*/) {
    const promise = this._super.apply(this, arguments);

    return promise.then((/* resp */) => {
      if (this.get('scope.current.clusterId') === this.get('id')) {
        this.get('scope').getAll().then((projects) => {
          let defProject = projects.findBy('isDefault', true);
          this.get('scope').selectDefaultProject(defProject.get('id'));
        });
      } else {
        this.get('scope').refreshAllClusters();
      }
    });
  },

  defaultProject: computed('projects.@each.{name,clusterOwner}', function() {
    let projects = this.get('projects');

    let out = projects.findBy('name','Default');
    if ( out ) {
      return out;
    }

    out = projects.findBy('clusterOwner', true);
    if ( out ) {
      return out;
    }

    out = projects.objectAt(0);
    return out;
  }),

  canEdit: computed('actionLinks.{activate,deactivate}','links.{update,remove}', function() {
    return (this.get('links.update') && this.get('state') === 'inactive') ? true : false;
  }),

  systemProject: computed('projects.@each.{clusterOwner}', function() {
    return this.get('projects').findBy('clusterOwner', true);
  }),

  availableActions: computed('actionLinks.{activate,deactivate}','links.{update,remove}', function() {
    //    let a = this.get('actionLinks');
    let l = this.get('links');

    var choices = [
      { label: 'action.edit',             icon: 'icon icon-edit',         action: 'edit',         enabled: this.get('canEdit') },
      { divider: true },
      //      { label: 'action.activate',         icon: 'icon icon-play',         action: 'activate',     enabled: !!a.activate},
      //      { label: 'action.deactivate',       icon: 'icon icon-pause',        action: 'promptStop',   enabled: !!a.deactivate, altAction: 'deactivate'},
      //      { divider: true },
      { label: 'action.remove',           icon: 'icon icon-trash',        action: 'promptDelete', enabled: !!l.remove, altAction: 'delete', bulkable: true },
      { divider: true },
      { label: 'action.viewInApi',        icon: 'icon icon-external-link',action: 'goToApi',      enabled: true },
    ];

    return choices;
  }),

  // @TODO real data
  numHosts: computed(function() {
    return 3+Math.round(Math.random()*2);
  }),

  numCores: computed('numHosts', function() {
    return this.get('numHosts')*8;
  }),

  numGhz: computed('numCores', function() {
    return 3.4*this.get('numCores');
  }),

  numMem: computed('numHosts', function() {
    return 8*this.get('numHosts');
  }),

  numStorage: computed('numHosts', function() {
    return 40*this.get('numHosts');
  }),
});

Cluster.reopenClass({
  pollTransitioningDelay: 1000,
  pollTransitioningInterval: 5000,
});

export default Cluster;

import { hash } from 'rsvp';
import { get } from '@ember/object';
import Route from '@ember/routing/route';

export default Route.extend({
  globalStore: service(),

  model(params) {
    const store = get(this, 'globalStore');
    return hash({
      project:  store.find('project', params.project_id),
      projects: store.findAll('project'),
      roles:    store.findAll('projectRoleTemplate'),
    });
  },
});

import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';

/**
 * @customElement
 * @polymer
 */
class CourseName extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>
			<h2>CourseName [[name]]!</h2>
			<!--<h2>NextCourseHref is [[nextCourseHref]]</h2>
			<div>Token is [[token]]</div>
			<div>Href is [[href]]</div>-->
		`;
	}
	static get properties() {
		return {
			name: {
				type: String,
				computed: '_getName(entity)'
			},
			nextCourseHref: {
				type: String,
				computed: '_getNextCourseHref(entity)'
			}
		};
	}

	static get is() { return 'course-name'; }

	_getName(entity) {
		return entity && entity.properties && entity.properties.name || '';
	}

	_getNextCourseHref(entity) {
		return entity
			&& entity.hasLinkByRel('https://api.brightspace.com/rels/next-course')
			&& entity.getLinkByRel('https://api.brightspace.com/rels/next-course').href;
	}
}

window.customElements.define(CourseName.is, CourseName);

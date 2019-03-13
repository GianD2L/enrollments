import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';

/**
 * @customElement
 * @polymer
 */
class CoursesList extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Siren.SirenActionBehaviorImpl
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}

				.courses-list {
					display: flex;
					flex-flow: row wrap;
					justify-content: flex-start;
				}
			</style>
			<h2>List of Enrollments</h2>
			<div class="courses-list">
				<template is="dom-repeat" items="[[_enrollments]]">
					<course-enrollment href="[[item]]" token="[[token]]"></course-enrollment>
				</template>
			</div>
		`;
	}
	static get properties() {
		return {
			_entity: {
				type: String,
				observer: '_entityChanged',
				computed: '_getEntity(entity)'
			},
			_enrollments: Array
		};
	}

	static get is() { return 'courses-list'; }

	connectedCallback() {
		super.connectedCallback();
	}
	disconnectedCallback() {
		super.disconnectedCallback();
	}

	_getEntity(entity) {
		return entity;
	}

	_entityChanged(newValue, oldValue) {
		var entity = newValue;
		var enrollmentsSearchAction = entity && entity.getActionByName('search-my-enrollments');
		if (enrollmentsSearchAction) {
			this.performSirenAction(enrollmentsSearchAction).then(function(enrollments) {
				var enrollmentsHrefs = [];
				var enrollmentEntities = enrollments && enrollments.getSubEntitiesByClass('enrollment');
				if (enrollmentEntities) {
					enrollmentEntities.forEach(function(enrollment) {
						enrollmentsHrefs.push(enrollment.href);
					}, this);
				}
				this._enrollments = enrollmentsHrefs;
			}.bind(this));
		}
	}
}

window.customElements.define(CoursesList.is, CoursesList);

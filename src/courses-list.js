import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';

/**
 * @customElement
 * @polymer
 */
class CoursesList extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}
			</style>
			<h2>List of Enrollments</h2>
			<div class="courses-list">
				<template is="dom-repeat" items="[[_enrollments]]">
					<course-card href="[[item.orgunit]]" enrollment="[[item.enrollment]]" token="[[token]]"></course-card>

					<!--<course-name href="[[item.orgunit]]" token="[[token]]"></course-name>
					<course-pin href="[[item.enrollment]]" token="[[token]]"></course-pin>-->
				</template>
			</div>
		`;
	}
	static get properties() {
		return {
			_enrollments: {
				type: Array,
				computed: '_getEnrollments(entity)'
			}
		};
	}

	static get is() { return 'courses-list'; }

	_getEnrollments(entity) {
		var enrollmentEntities = entity && entity.getSubEntitiesByClass('enrollment');
		var enrollments = [];
		if (enrollmentEntities) {
			enrollmentEntities.forEach(function(enrollment) {
				var enrollmentLink = enrollment && enrollment.getLinkByRel('self');
				var orgunitLink = enrollment && enrollment.getLinkByRel('https://api.brightspace.com/rels/organization');
				if (enrollmentLink && orgunitLink) {
					enrollments.push({enrollment: enrollmentLink.href, orgunit: orgunitLink.href});
				}
			}, this);
		}
		return enrollments
	}
}

window.customElements.define(CoursesList.is, CoursesList);

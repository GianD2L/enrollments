import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-course-image/d2l-course-image.js';
/**
 * @customElement
 * @polymer
 */
class CourseImage extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: inline-block;
				}

				img {
					display: block;
					width: 100%;
				}
			</style>

			<div class="d2l-enrollment-card-image-container">
				<d2l-course-image image="[[image]]" sizes="[[_tileSizes]]" type="tile">
				</d2l-course-image>
			</div>
		`;
	}

	static get properties() {
		return {
			_tileSizes: {
				type: Object,
				value: function() {
					return {
						mobile: {
							maxwidth: 767,
							size: 100
						},
						tablet: {
							maxwidth: 1243,
							size: 67
						},
						desktop: {
							size: 25
						}
					};
				}
			},

			image: {
				type: Object,
				computed: '_getImage(entity)'
			}
		};
	}

	static get is() { return 'course-image'; }

	_getImage(entity) {
		return entity;
	}
}

window.customElements.define(CourseImage.is, CourseImage);

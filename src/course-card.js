import {html, PolymerElement} from '@polymer/polymer/polymer-element.js';
import { mixinBehaviors } from '@polymer/polymer/lib/legacy/class.js';
import 'd2l-polymer-siren-behaviors/store/entity-behavior.js';
import 'd2l-polymer-siren-behaviors/store/siren-action-behavior.js';
import 'd2l-card/d2l-card.js';
import 'd2l-card/d2l-card-content-title.js';
import 'd2l-card/d2l-card-content-meta.js';
import 'd2l-card/d2l-card-footer-link.js';
import 'd2l-card/d2l-card-loading-shimmer.js';
import 'd2l-dropdown/d2l-dropdown-menu.js';
import 'd2l-dropdown/d2l-dropdown-more.js';
import 'd2l-dropdown/d2l-dropdown-content.js';
import 'd2l-menu/d2l-menu-item.js';
import 'd2l-menu/d2l-menu-item-link.js';
import 'd2l-button/d2l-button-icon.js';
import 'd2l-icons/tier1-icons.js';

/**
 * @customElement
 * @polymer
 */
class CourseCard extends mixinBehaviors([
	D2L.PolymerBehaviors.Siren.EntityBehavior,
	D2L.PolymerBehaviors.Siren.SirenActionBehaviorImpl
], PolymerElement) {
	static get template() {
		return html`
			<style>
				:host {
					display: block;
				}

				<!--.course-card-container {
					border: 2px solid red;
					border-radius: 5px;
					background-color: lightgrey;
				}-->

				d2l-card {
					height: 200px;
					width: 280px;
					margin: 10px;
				}
			</style>

			<d2l-card text="Course Card">
				<course-image slot="header" href="[[imageHref]]" token="[[token]]"></course-image>
				
				<!--<d2l-dropdown-more slot="actions" translucent="" visible-on-ancestor="" text="Open!">
						<d2l-dropdown-content>
							<div>This is where you could put the super cool features for your card!</div>
							<br>
							<div>As with all dropdowns, you can choose between a generic dropdown container, or a menu specific one.</div>
						</d2l-dropdown-content>
				</d2l-dropdown-more>-->
				<d2l-dropdown-more slot="actions" translucent="" visible-on-ancestor="" text="Open!">
					<d2l-dropdown-menu>
						<d2l-menu>
							<d2l-menu-item on-d2l-menu-item-select="_pinClickHandler" hidden$="[[pinned]]" text="Pin the course"></d2l-menu-item>
							<d2l-menu-item on-d2l-menu-item-select="_pinClickHandler" hidden$="[[!pinned]]" text="Unpin the course"></d2l-menu-item>
						</d2l-menu>
					</d2l-dropdown-menu>
				</d2l-dropdown-more>
				<d2l-button-icon slot="actions"
					translucent=""
					hidden$="[[!pinned]]"
					text="Pinned Course"
					icon="d2l-tier1:pin-filled"
					on-tap="_pinClickHandler" on-keypress="_pinPressHandler">
				</d2l-button-icon>

				<course-name slot="content" href="[[href]]" token="[[token]]"></course-name>
			</d2l-card>
		`;
	}

	static get properties() {
		return {
			imageHref: {
				type: String,
				computed: '_getImageHref(entity)'
			}
		};
	}
	
	static get is() { return 'course-card'; }

	_getImageHref(entity) {
		var imageEntity = entity && entity.getSubEntityByClass('course-image')
		return imageEntity && imageEntity.href;
	}

	_pinPressHandler(e) {
		if (e.code === 'Space' || e.code === 'Enter') {
			this._pinClickHandler();
		}
	}
	
	_pinClickHandler() {
		if (!this.pinAction) {
			return;
		}

		this.performSirenAction(this.pinAction).then(function(value) {
			console.log(value);
		}.bind(this));
	}
}

window.customElements.define(CourseCard.is, CourseCard);

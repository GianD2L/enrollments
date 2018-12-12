/*
`d2l-enrollment-updates`

Polymer-based web component for a enrollment updates.
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import 'd2l-organizations/components/d2l-organization-updates/d2l-organization-updates.js';
import 'd2l-card/d2l-card-footer-link.js';
import 'd2l-tooltip/d2l-tooltip.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-enrollment-updates">
	<template strip-whitespace="">
		<style>
			.d2l-enrollment-card-updates-tooltip {
				@apply --d2l-body-small-text;
				color: #FFFFFF;
				white-space:nowrap;
			}
			.d2l-enrollment-card-updates-tooltip[disabled] {
				display: none;
			}
			.d2l-enrollment-card-updates-tooltip ul {
				margin: 0px;
				padding: 0px;
				list-style-type: none;
			}
			.d2l-enrollment-card-updates-tooltip ul li {
				margin: 0px;
				padding: 0px;
			}
		</style>
		<template is="dom-repeat" items="[[_notifications]]">
			<template is="dom-if" if="[[!item.isDisabled]]">
				<d2l-card-footer-link id="[[item.key]]" icon="[[item.icon]]" text="[[item.ariaLabel]]" href$="[[item.link]]" secondary-text="[[_toString(item.updateCount)]]">
				</d2l-card-footer-link>
				<d2l-tooltip class="d2l-enrollment-card-updates-tooltip" for="[[item.key]]" position="top" disabled$="[[item.isDisabled]]">
					<ul>
						<template is="dom-repeat" items="[[item.toolTip]]">
							<li>[[item]]</li>
						</template>
					</ul>
				</d2l-tooltip>
			</template>
		</template>
	</template>
	
</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-enrollment-updates',

	properties: {
		href: String,
		presentationHref: String,

		_notifications: {
			type: Array,
			value: function() { return []; }
		}
	},

	behaviors: [
		D2L.PolymerBehaviors.Organization.Updates.Behavior
	],

	observers: [
		'_fetchNotifications(href, presentationHref)'
	],

	_fetchNotifications: function(notificationsUrl, presentationUrl) {
		if (!notificationsUrl || !presentationUrl) {
			return Promise.resolve();
		}
		return this._orgUpdates_fetch(notificationsUrl, presentationUrl)
			.then(function(notification) {
				this._notifications = this._orgUpdates_notifications(notification);
			}.bind(this));
	},
	_toString: function(a) {
		if (typeof a !== String) {
			return a.toString();
		}

		return a;
	}
});

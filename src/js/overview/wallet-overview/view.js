import {ItemView} from "backbone.marionette";
import template from "./template.hbs";

import app from "../../app";

import Radio from "backbone.radio";

let walletChannel = Radio.channel("wallet");

export default ItemView.extend({
	template: template,
	id: "wallet-overview",

	modelEvents: {
		"all": "render"
	},

	initialize() {
		walletChannel.on("wallet:activeChanged", () => {
			if (!this.isDestroyed) this.render();
		});

		walletChannel.on("names:count", () => {
			if (!this.isDestroyed) this.render();
		});
	},

	serializeData() {
		return {
			address: this.model.get("address"),
			balance: this.model.get("balance")
		};
	},

	templateHelpers: {
		loggedIn() {
			return typeof app.activeWallet !== "undefined" && app.activeWallet !== null;
		},

		krist(balance) {
			return balance.toLocaleString() + " KST";
		},

		names() {
			if (app.activeWallet && app.activeWallet.nameCount) {
				return app.activeWallet.nameCount;
			} else {
				return 0;
			}
		},

		pluralize(number, single, plural) {
			return Number(number) == 1 ? single : plural;
		}
	}
});
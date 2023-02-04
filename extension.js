/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const GETTEXT_DOMAIN = "goldprice-indicator-extension";

const { GObject, St, Gtk, Clutter } = imports.gi;
const Gio = imports.gi.Gio;

const Gettext = imports.gettext.domain(GETTEXT_DOMAIN);
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Soup = imports.gi.Soup;
const Mainloop = imports.mainloop;
const GLib = imports.gi.GLib;

const GoldPriceIndicator = GObject.registerClass(
  class GoldPriceIndicator extends PanelMenu.Button {
    _init() {
      super._init(0.0, _("GOldPriceIndicatorButton"));
      this.periodic_task;
      this.lock = false;
      this.settings;
      this.extension_icon;
      this.price;
      this.lastUpdate;
      this.menu;
      this.api_url = "https://finans.truncgil.com/v4/today.json";
      this._httpSession = new Soup.Session();

      let gschema = Gio.SettingsSchemaSource.new_from_directory(
        Me.dir.get_child("schemas").get_path(),
        Gio.SettingsSchemaSource.get_default(),
        false
      );
      // settings
      this.settings = new Gio.Settings({
        settings_schema: gschema.lookup(
          "org.gnome.shell.extensions.finans-monitor",
          true
        ),
      });

      // Indicator
      let box = new St.BoxLayout({ style_class: "panel-status-menu-box" });
      this.price = new St.Label({
        text: "...",
        style: "padding-top: 2px;",
        y_align: Clutter.ActorAlign.CENTER,
        x_align: Clutter.ActorAlign.FILL,
      });

      // drop-down menu
      this.lastUpdate = new PopupMenu.PopupMenuItem(_("Son Güncelleme:"));
      let refresh = new PopupMenu.PopupMenuItem(_("Yenile"));

      refresh.connect("activate", () => {
        this.refreshData();
      });

      // set widgets
      this.menu.addMenuItem(this.lastUpdate);
      this.menu.addMenuItem(refresh);

      // box.add_child(this.extension_icon);
      box.add_child(this.price);
      this.add_child(box);

      this.refreshData();
    }

    buildRequest() {
      const url = this.api_url ;
      let request = Soup.Message.new("GET", url);
      request.request_headers.append("Cache-Control", "no-cache");
      request.request_headers.append(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 6.3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.84 Safari/537.36"
      );

      // this.log([url]); // debug
      return request;
    }

    refreshData() {
      if (this.lock) {
        return;
      }
      this.lock = true;
      let msg = this.buildRequest();
      this._httpSession.send_and_read_async(
        msg,
        GLib.PRIORITY_DEFAULT,
        null,
        (_, response) => {
          response = new TextDecoder("utf-8").decode(
            this._httpSession.send_and_read_finish(response).get_data()
          );

          if (msg.get_status() > 299) {
            this.log(["Uzak sunucu hatası:", msg.get_status(), response]);
            return;
          }

          const json_data = JSON.parse(response);
          if (json_data.length === 0) {
            this.log(["Uzak sunucu hatası:", response]);
            return;
          }
          let currency = this.settings.get_value("currency").unpack();

          let latest_price = JSON.stringify(json_data[currency]['Buying']).slice(1, -1);;

          this.log([
            `Fiyat güncellendi: ${this.price.text}, ${latest_price}`,
          ]);

          this.price.text = latest_price;

          this.lastUpdate.label_actor.text =
            "Son Güncelleme: " + new Date().toLocaleTimeString();
        }
      );
      this.lock = false;
      this.purgeBackgroundTask();
      this.periodic_task = Mainloop.timeout_add_seconds(
        this.settings.get_value("refresh-interval").unpack() * 60,
        () => {
          this, this.refreshData;
        }
      );
    }

    log(logs) {
      global.log("[FinansMonitörü]", logs.join(", "));
    }

    purgeBackgroundTask() {
      if (this.periodic_task) {
        GLib.Source.remove(this.periodic_task);
        this.periodic_task = null;
      }
    }
  }
);

class Extension {
  constructor(uuid) {
    this._uuid = uuid;
    ExtensionUtils.initTranslations(GETTEXT_DOMAIN);
  }

  enable() {
    this._indicator = new GoldPriceIndicator();

    const indicator_position = this._indicator.settings
      .get_value("panel-position")
      .unpack();
    if (indicator_position === "Sol") {
      Main.panel.addToStatusArea(
        this._uuid,
        this._indicator,
        Main.panel._leftBox.get_children().length,
        "left"
      );
    } else if (indicator_position === "Orta") {
      Main.panel.addToStatusArea(
        this._uuid,
        this._indicator,
        Main.panel._centerBox.get_children().length,
        "center"
      );
    } else {
      Main.panel.addToStatusArea(this._uuid, this._indicator);
    }

    this._indicator.settings.connect("changed::panel-position", () => {
      this.addToPanel();
    });
  }

  disable() {
    this._indicator.purgeBackgroundTask();
    this._indicator.destroy();
    this._indicator = null;
  }

  addToPanel() {
    this._indicator.destroy();
    this._indicator = null;
    this._indicator = new GoldPriceIndicator();
    const indicator_position = this._indicator.settings
      .get_value("panel-position")
      .unpack();
    if (indicator_position === "Sol") {
      Main.panel.addToStatusArea(
        this._uuid,
        this._indicator,
        Main.panel._leftBox.get_children().length,
        "left"
      );
    } else if (indicator_position === "Orta") {
      Main.panel.addToStatusArea(
        this._uuid,
        this._indicator,
        Main.panel._centerBox.get_children().length,
        "center"
      );
    } else {
      Main.panel.addToStatusArea(this._uuid, this._indicator);
    }
  }
}

function init(meta) {
  return new Extension(meta.uuid);
}

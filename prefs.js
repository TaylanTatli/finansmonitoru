'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Soup = imports.gi.Soup;
const Currencies = Me.imports.currencies;


function init() {
}

function buildPrefsWidget() {

    // Copy the same GSettings code from `extension.js`
    let gschema = Gio.SettingsSchemaSource.new_from_directory(
        Me.dir.get_child('schemas').get_path(),
        Gio.SettingsSchemaSource.get_default(),
        false
    );

    this.settings = new Gio.Settings({
        settings_schema: gschema.lookup('org.gnome.shell.extensions.finans-monitor', true)
    });

    // Create a parent widget that we'll return from this function
    let prefsWidget = new Gtk.Grid({
        margin_top: 18,
        margin_bottom: 18,
        margin_start: 18,
        margin_end: 18,
        column_spacing: 30,
        row_spacing: 18,
        visible: true
    });
    // Currency
    let currency_label = new Gtk.Label({
        label: 'Birim (' + this.settings.get_value('currency').unpack() + ') :',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(currency_label, 0, 2, 1, 1);
    let currencies_dropdown = Gtk.DropDown.new_from_strings(Currencies.currencies.map((val) => {
        return val.name;
    }));
    Currencies.currencies.forEach((item, index) => {
        if (item.unit == this.settings.get_value('currency').unpack()) {
            currencies_dropdown.selected = index;
        }
    })
    prefsWidget.attach(currencies_dropdown, 1, 2, 4, 1);

    // Refresh interval (seconds)
    let refresh_label = new Gtk.Label({
        label: 'Yenileme Sıklığı (Dakika):',
        halign: Gtk.Align.START,
        visible: true
    });
    prefsWidget.attach(refresh_label, 0, 3, 1, 1);
    let refresh_scale = Gtk.Scale.new_with_range(Gtk.Orientation.HORIZONTAL, 5, 60, 1);
    refresh_scale.draw_value = true;
    refresh_scale.set_value(this.settings.get_value('refresh-interval').unpack());
    prefsWidget.attach(refresh_scale, 1, 3, 4, 1);

    // Position in panel
    let panel_position_label = new Gtk.Label({
        label: 'Paneldeki Yeri:',
        halign: Gtk.Align.START,
        visible: true,
    });
    prefsWidget.attach(panel_position_label, 0, 5, 1, 1);
    let panel_position_combo = buildComboBox(['Sol', 'Orta', 'Sağ'], this.settings.get_value('panel-position').unpack());
    prefsWidget.attach(panel_position_combo, 1, 5, 4, 1);

    // Events    
    currencies_dropdown.connect("notify::selected", () => {
        this.settings.set_string('currency', Currencies.currencies[currencies_dropdown.get_selected()].unit);
    })
    refresh_scale.connect('value-changed', () => {
        this.settings.set_int('refresh-interval', refresh_scale.get_value());
    });

    panel_position_combo.connect('changed', () => {
        this.settings.set_string('panel-position', panel_position_combo.active_id);
    });
    // Return our widget which will be added to the window
    return prefsWidget;
}

function buildComboBox(options, active) {
    let comboBox = new Gtk.ComboBoxText({});
    options.forEach(val => {
        comboBox.append(val, val);
        if (active == val) {
            comboBox.set_active_id(val);
        }
    });
    return comboBox;
}

function log(logs) {
    print('[FinansMonitörü-Settings]', logs.join(', '));
}
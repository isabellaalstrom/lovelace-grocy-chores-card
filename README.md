# grocy-chores-card
A Lovelace custom card for [custom component Grocy](https://github.com/custom-components/grocy) in Home Assistant.

<img src="https://github.com/isabellaalstrom/lovelace-grocy-chores-card/blob/master/grocy-chores-card.png" alt="Grocy Chores Card" />

Easiest installation via [HACS](https://custom-components.github.io/hacs/).

For manual installation see [this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).


**This card reqires [card tools](https://github.com/thomasloven/lovelace-card-tools).**



## Example configuration



```yaml
title: My awesome Lovelace config
resources:
  - url: /local/grocy-chores-card.js
    type: js
views:
  title: My view
  cards:
    - type: custom:grocy-chores-card
      entity: sensor.grocy_chores
```

## Options

| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:grocy-chores-card`
| entity | string | **Required** | The entity id of your Grocy sensor.
| title | string | `"Chores"` | The title of the card.
| show_quantity | number | **Optional** | The number of chores you want to show in the card.
| show_days | number | **Optional** | `7` to only show chores that's due within 7 days.
| user_id | number | **Optional** | Id of the Grocy user performing the tasks. Default if not specified is `1`, which should be the admin user in Grocy.


Like my work and want to say thanks? Do it here:

<a href="https://www.buymeacoffee.com/iq1f96D" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

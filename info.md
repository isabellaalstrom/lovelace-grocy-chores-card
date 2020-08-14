# grocy-chores-card
A Lovelace custom card for [custom component Grocy](https://github.com/custom-components/grocy) in Home Assistant.

<img src="https://github.com/isabellaalstrom/lovelace-grocy-chores-card/blob/master/grocy-chores-card.png" alt="Grocy Chores Card" />

**This card reqires [card tools](https://github.com/thomasloven/lovelace-card-tools).**

## Example configuration

```yaml
title: My awesome Lovelace config
resources:
  - url: /local/grocy-chores-card.js -or- /community_plugin/lovelace-grocy-chores-card/grocy-chores-card.js  
    type: js
views:
  title: My view
  cards:
    - type: custom:grocy-chores-card
      entity: sensor.grocy_chores
```

## Options

| Name | Type | Optional | Default | Description
| ---- | ---- | -------- | ------- | -----------
| type | string | **Required** |  | `custom:grocy-chores-card`
| entity | string | **Required** |  | The entity id of your Grocy chores sensor.
| title | string | **Optional** | `"Chores"` | The title of the card.
| show_quantity | number | **Optional** |  | The number of chores you want to show in the card.
| show_days | number | **Optional** |  | `7` to only show chores that's due within 7 days.
| user_id | number | **Optional** | `1` | Id of the Grocy user performing the tasks. Default if not specified is `1`, which should be the admin user in Grocy.
| custom_translation | string-list | **Optional** |  | List of translations of string values used in the card (see below).
| filter | string | **Optional** |  | Only show chores that contains this filter in the name.
| remove_filter | bool | **Optional** |  | Use together with `filter` to remove the filter from the name when showing in card. Chore name "Yard work: Clean rain gutters" with filter "Yard work: " will then only display "Clean rain gutters".
| filter_user | number | **Optional** |  | Only show chores assigned to the used with this user_id. Ex: `1`
| show_assigned | bool | **Optional** | `true` | Show who's assigned to the chore
| show_last_tracked | bool | **Optional** | `true` | Show when someone last tracked this chore
| show_last_tracked_by | bool | **Optional** | `true` | Show who last tracked this chore (`show_last_tracked` must be true to show this)

## Advanced options
It is possible to translate the following English strings in the card to whatever you like.

```yaml
custom_translation:
  Overdue: "Försenad"
  Today: "Idag"
  Due: "Dags"
  'Last tracked': "Senast"
  by: "av"
  Track: "Gör nu"
  'No chores': "Tom"
  'Look in Grocy for {number} more chores': "Det finns {number} fler göromål i Grocy"
```


Like my work and want to say thanks? Do it here:

<a href="https://www.buymeacoffee.com/iq1f96D" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

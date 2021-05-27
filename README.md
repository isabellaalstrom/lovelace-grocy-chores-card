# grocy-chores-card

A Lovelace custom card for [custom component Grocy](https://github.com/custom-components/grocy) in Home Assistant.

<img src="https://github.com/isabellaalstrom/lovelace-grocy-chores-card/blob/master/grocy-chores-card.png" alt="Grocy Chores Card" />

Easiest installation via [HACS](https://custom-components.github.io/hacs/).

For manual installation see [this guide](https://github.com/thomasloven/hass-config/wiki/Lovelace-Plugins).



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
      entity:
        - sensor.grocy_chores
        - sensor.grocy_tasks
```

## Options

| Name | Type | Optional | Default | Description
| ---- | ---- | -------- | ------- | -----------
| type | string | **Required** |  | `custom:grocy-chores-card`
| entity | string/list | **Required** |  | The entity id(s) of your Grocy chores and/or tasks sensor(s).
| title | string | **Optional** | `"Todo"` | The title of the card.
| show_quantity | number | **Optional** |  | The number of items you want to show in the card.
| show_days | number | **Optional** |  | `0` to only show items that's due today or overdue. If not specified, shows all items.
| user_id | number | **Optional** | `1` | Id of the Grocy user performing the items. Default if not specified is `1`. See further instructions [here](#user_id).
| custom_translation | string-list | **Optional** |  | List of translations of string values used in the card (see below).
| filter | string | **Optional** |  | Only show items that contains this filter in the name.
| remove_filter | bool | **Optional** |  | Use together with `filter` to remove the filter from the name when showing in card. Chore name "Yard work: Clean rain gutters" with filter "Yard work: " will then only display "Clean rain gutters".
| filter_user | number | **Optional** |  | Only show items assigned to the used with this user_id. Ex: `1`
| show_assigned | bool | **Optional** | `true` | Show who's assigned to the item (does not work on tasks).
| show_last_tracked | bool | **Optional** | `true` | Show when someone last tracked this chore (does not work on tasks).
| show_last_tracked_by | bool | **Optional** | `true` | Show who last tracked this chore (`show_last_tracked` must be true to show this) (does not work on tasks).
| show_track_button | bool | **Optional** | `true` | Show track (complete) button
| show_empty | bool | **Optional** | `true` | Set to false to hide card when no items
| show_create_task | bool | **Optional** | `false` | Set to true to show ability to add a task in Grocy directly from the card.

## Advanced options
It is possible to translate the following English strings in the card to whatever you like.

```yaml
custom_translation:
  Overdue: "Försenad"
  Today: "Idag"
  Due: "Dags"
  'Assigned to': "Tilldelad"
  'Last tracked': "Senast"
  by: "av"
  Track: "Gör nu"
  'No todos': "Tomt"
  'Look in Grocy for {number} more items': "Det finns {number} fler göromål i Grocy"
  'Add task': "Lägg till"
  'Optional due date/time': "Valfritt datum/tid"
  "'Name' can't be empty": "Fyll i namn"
```

## <a name="user_id"></a> How to get the correct user id?
Currently, [this issue in Grocy](https://github.com/grocy/grocy/issues/1260) results in only being able to track chores for the user id that created the api key used in the integration in Home Assistant. The issue is fixed but not yet released. In the meantime, follow these instructions to get the correct user id to be able to track chores from the card:

1. Login to Grocy. Go to `http://yourgrocyip:port/manageapikeys`
2. Note which user has created the api key used with the HA integration.
3. Go to `http://yourgrocyip:port/api/users`
4. Find the user that corresponds to the user who created the api key in step 2.
5. Note the id for that user. If the id is not `1` you need to specify `user_id` to that user id in the cards configuration to be able to track chores.

---

Like my work and want to say thanks? Do it here:

<a href="https://www.buymeacoffee.com/iq1f96D" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

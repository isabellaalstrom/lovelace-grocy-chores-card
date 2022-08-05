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
| show_quantity | number | **Optional** |  | The number of items you want to show in the card. The rest are either hidden or show in the overflow.
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
| show_create_task | bool | **Optional** | `false` | Set to true to show ability to add a task in Grocy directly from the card. (not functional at this time).
| browser_mod | bool | **Optional** | `false` | Set to true _if you have installed [browser_mod](https://github.com/thomasloven/hass-browser_mod)_ and want feedback when tracking, in the form of a native toast bar.
| show_overflow | boolean | false | When true, replaces the 'Look in Grocy for X more items' text with a 'Show X more' button that toggles an overflow area.
| show_divider | boolean | false | When true, shows a divider between each task. Uses the CSS variable 'entities-divider-color' from your theme.
| use_icons | boolean |  | When null, uses icons for chores/tasks only when chore_icon or task_icon is set. When true, forces defaults if chore_icon/task_icon is not set. When false, overrides chore_icon/task_icon and always uses text buttons.
| task_icon | string |  | Sets the icon used on Tasks. Replaces the text. Set "use_icons" to true and don't use this parameter to use default icon. */
| task_icon_size | number | 24 | Sets the size of the icon for Tasks. Default is 24 because default is an empty checkbox. Only applies when use_icon or task_icon is set.
| chore_icon | string |  | Sets the icon used on Chores. Replaces the text. Set "use_icons" to true and don't use this parameter to use default icon.
| chore_icon_size | number | 32 | Sets the size of the icon for Chores. Default is 32. Only applies when use_icon or chore_icon is set.
| expand_icon_size | number | 30 | Sets the size of the expand/collapse button on the Overflow area. Default is 30. Only applies when use_icon or show_overflow is set.
| use_long_date | boolean | false | Sets if the Due/Completed dates are formatted in long format (i.e. December 31, 2022) or short format (i.e. 12/31/2022). Uses localization settings for token order.
| due_in_days_threshold | number | 0 | Due dates are reported as 'Overdue', 'Today', 'Tomorrow', 'In X Days', and finally using the actual date. This sets how many days use the 'In X Days' format before it switches to using date notation.
| use_24_hours | boolean | true | Sets if the times are shown in 12 hour or 24 hour formats.
| hide_text_with_no_data | boolean | false | When true, if a property for an item is not set, it hides the text. For example, if a chore has never been completed, instead of showing 'Last tracked: -', it will hide the 'Last tracked' row entirely.


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
  Tracked: "Färdigställt"
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

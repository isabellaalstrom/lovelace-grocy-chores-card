[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge)](https://github.com/hacs/integration)

# grocy-chores-card

A Lovelace custom card for [custom component Grocy](https://github.com/custom-components/grocy) in Home Assistant.

<img src="https://github.com/clarinetJWD/lovelace-grocy-chores-card/blob/master/grocy-chores-card.png" alt="Grocy Chores Card" />

**This card reqires [card tools](https://github.com/thomasloven/lovelace-card-tools).**

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

| Name                         | Type        | Optional     | Default  | Description                                                                                                                                                                                                                          |
|------------------------------|-------------|--------------|----------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| type                         | string      | **Required** |          | `custom:grocy-chores-card`                                                                                                                                                                                                           |
| entity                       | string/list | **Required** |          | The entity id(s) of your Grocy chores and/or tasks sensor(s).                                                                                                                                                                        |
| title                        | string      | **Optional** | `"Todo"` | The title of the card.                                                                                                                                                                                                               |
| show_quantity                | number      | **Optional** |          | The number of items you want to show in the card. The rest are either hidden or show in the overflow.                                                                                                                                |
| show_days                    | number/range | **Optional** |          | E.g. `0` to only show items that are due today, overdue or have no due date. If a range is specified show only tasks with a due date in that range; e.g. `1..10` would show tasks due in the next 10 days, but not overdue tasks, or tasks due today. If not specified, shows all items.                                                                                                                      |
| show_chores_without_due      | bool        | **Optional** | `true`   | Show chores that do not have a due date.                                                                                                                                                                                             |
| show_tasks_without_due       | bool        | **Optional** | `true`   | Show tasks that do not have a due date.                                                                                                                                                                                              |
| user_id                      | number      | **Optional** | `1`      | Id of the Grocy user performing the items. Default if not specified is `1`. See further instructions [here](#user_id).                                                                                                               |
| custom_translation           | string-list | **Optional** |          | List of translations of string values used in the card (see below).                                                                                                                                                                  |
| filter                       | string/list | **Optional** |          | Only show items that contains this filter in the name. When filter is a list, filters are applied as OR.                                                                                                                             |
| remove_filter                | bool        | **Optional** |          | Use together with `filter` to remove the filter from the name when showing in card. Chore name "Yard work: Clean rain gutters" with filter "Yard work: " will then only display "Clean rain gutters".                                |
| filter_user                  | number      | **Optional** |          | Only show items assigned to the used with this user_id. Ex: `1`                                                                                                                                                                      |
| show_assigned                | bool        | **Optional** | `true`   | Show who's assigned to the item (does not work on tasks).                                                                                                                                                                            |
| show_last_tracked            | bool        | **Optional** | `true`   | Show when someone last tracked this chore (does not work on tasks).                                                                                                                                                                  |
| show_last_tracked_by         | bool        | **Optional** | `true`   | Show who last tracked this chore (`show_last_tracked` must be true to show this) (does not work on tasks).                                                                                                                           |
| show_track_button            | bool        | **Optional** | `true`   | Show track (complete) button                                                                                                                                                                                                         |
| show_empty                   | bool        | **Optional** | `true`   | Set to false to hide card when no items                                                                                                                                                                                              |
| show_create_task             | bool        | **Optional** | `false`  | Set to true to show ability to add a task in Grocy directly from the card. Due date must be in format yyyy-mm-dd, e.g. 2022-01-31. When due date is empty, task has no due date.                                                     |
| browser_mod                  | bool        | **Optional** | `false`  | Set to true _if you have installed [browser_mod v2](https://github.com/thomasloven/hass-browser_mod)_ and want feedback when tracking or adding a task, in the form of a native toast bar.                                           |
| show_overflow                | bool        | **Optional** | `false`  | When true, replaces the 'Look in Grocy for X more items' text with a 'Show X more' button that toggles an overflow area.                                                                                                             |
| show_divider                 | bool        | **Optional** | `false`  | When true, shows a divider between each task. Uses the CSS variable `entities-divider-color` and falls back on `divider-color` from your theme.                                                                                      |
| use_icons                    | bool        | **Optional** |          | When null, uses icons for chores/tasks only when `chore_icon` or `task_icon` is set. When true, forces defaults if `chore_icon`/`task_icon` is not set. When false, overrides `chore_icon`/`task_icon` and always uses text buttons. |
| task_icon                    | string      | **Optional** |          | Sets the icon used on Tasks. Replaces the text. Set `use_icons` to true and don't use this parameter to use default icon.                                                                                                            |
| task_icon_size               | number      | **Optional** | `24`     | Sets the size of the icon for Tasks. Default is 24 because default is an empty checkbox. Only applies when `use_icon` or `task_icon` is set.                                                                                         |
| chore_icon                   | string      | **Optional** |          | Sets the icon used on Chores. Replaces the text. Set `use_icons` to true and don't use this parameter to use default icon.                                                                                                           |
| chore_icon_size              | number      | **Optional** | `32`     | Sets the size of the icon for Chores. Default is 32. Only applies when `use_icon` or `chore_icon` is set.                                                                                                                            |
| expand_icon_size             | number      | **Optional** | `30`     | Sets the size of the expand/collapse button on the Overflow area. Default is 30. Only applies when `show_overflow` is set.                                                                                                           |
| use_long_date                | bool        | **Optional** | `false`  | Sets if the Due/Completed dates are formatted in long format (i.e. December 31, 2022) or short format (i.e. 12/31/2022). Uses localization settings for token order.                                                                 |
| due_in_days_threshold        | number      | **Optional** | `0`      | Due dates are reported as 'Overdue', 'Today', 'Tomorrow', 'In X Days', and finally using the actual date. This sets how many days use the 'In X Days' format, before it switches to using date notation.                             |
| last_tracked_days_threshold  | number      | **Optional** | `0`      | Last tracked dates are reported as 'Today', 'Yesterday', 'x days ago' and finally the actual track date. This sets how many days use the 'x days ago' format, before it switches to using date notation.                             |
| use_24_hours                 | bool        | **Optional** | `true`   | Sets if the times are shown in 12 hour or 24 hour formats.                                                                                                                                                                           |
| hide_text_with_no_data       | bool        | **Optional** | `false`  | When true, if a property for an item is not set, it hides the text. For example, if a chore has never been completed, instead of showing 'Last tracked: -', it will hide the 'Last tracked' row entirely.                            |
| haptic                       | string      | **Optional** | `selection` | Can be set to `light`, `success`, or anything [listed here](https://companion.home-assistant.io/docs/integrations/haptics/#developers-integrating-haptics-into-custom-cards).                                                     |

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
5. Note the id for that user. If the id is not `1` you need to specify `user_id` to that user id in the cards configuration to be able to track tasks and chores.

## Using the Collapsible Overflow
Instead of the “Look in Grocy for X more items” text from older versions, this version can show all additional items in a collapsible overflow panel.

### Usage
1. Add the `show_quantity` parameter and set it to the number of items that should be shown in the main area.
2. Add the `show_overflow` parameter and set it to `true`.
3. To override the default size of the expand button icon, set `expand_icon_size` to an integer value.

Once you refresh, you should see a new button with an expand button at the bottom of the card if you have additional items. Click this to expand the card and show all items.
 
## Icon Buttons
This version adds the ability to use icons instead of the “TRACK” text buttons on each item. Tasks and Chores can have different icons and sizes.

### Usage
* `use_icons` parameter
  - When not used or `null`, icons are controlled by the other parameters.
  - When `true`, both Tasks and Chores will use an icon. If the associated parameters are not set, it will use the default icons.
  - When `false`, all other icon options are ignored and text-based buttons are used.
* `task_icon`/`chore_icon` parameters
  - When set to a valid icon (i.e. `mdi:check`), items of that type will use the specified icon instead of text as long as `use_icons` is not `false`.
  - When `use_icons` is true, you only need to use these parameters to override the default icons.
* `task_icon_size`/`chore_icon_size` parameters
  - When icons are used, specifies the height and width of the icon for that item type.
  - Default for chores is `32` (as it’s a button) and tasks is `24` (because it is a checkbox).

## Date Formatting
This version also introduces better date formatting. Each date is formatted based on the current user’s localization settings so that the order of tokens (day/month/year vs month/day/year) is correct. It also allows 12 or 24 hour times and long date formats (i.e. December 31, 2022).

### Usage
* `use_long_date` – When `true`, uses the long date format (i.e. December 31, 2022). When `false`, uses the short format (i.e. 12/31/2022). Default is `false`.
* `use_24_hours` – When `true`, the time is shown in 24 hour format (i.e. 17:59). When `false`, it uses 12 hour format (i.e. 5:59 pm). Default is to use 24 hour format (`true`).
* `due_in_days_threshold` – When set to a value grater than `1`, specifies how many days from today will be shown as “Due: In X Days”. Default is `0`, which means unused. For example, if it is set to `3`, your tasks should have the following due dates:
  - Due: Overdue
  - Due: Today
  - Due: Tomorrow
  - Due: In 2 Days
  - Due: In 3 Days
  - Due: August 9, 2022
  - Etc.

## Miscellaneous Style Options
* `show_divider` – When `true`, adds a divider between each task or chore. The color is specified in your theme using the `entities-divider-color` variable (with fallback to `divider-color`).
* `hide_text_with_no_data` – When `true`, when an item’s property is blank, that property is hidden regardless of other settings. For example, if you have `show_last_tracked` set to `true`, but a chore has never been completed, instead of showing “Last tracked: -”, the “Last tracked” line simply does not appear on that item (see Clean out the Fridge in the screenshot vs Sweep the Stairs).
* Some of the colors can now be specified in your theme using CSS variables.
  - `--red`: sets the color of Overdue due date.
  - `--orange`: sets the color of Today due date.
  - `--green`: sets the mouse-over color on icon buttons.
  - `--paper_font_subhead_-_font_size`: sets the size of the task title test.
  - `--paper_font_body1_-_font_size`: sets the size of the task’s other information text.
  - `--primary-text-color`: sets the title text, icon color, and item title text color.
  - `--secondary-text-color`: sets the color of other text.
  - `--accent-color`: sets the hover color of the Show More button and icon.
 
## Other changes in this version
In general, this update aims to not change any default setups so that anyone using this card won’t notice any change unless they change it themselves. However, some small changes have been made:

1. Date is always formatted using user’s localization settings rather than always appearing YYYY/MM//DD.
2. Due Date will be shown as “Tomorrow” when it is due in 1 day.
3. Task title line will now always use the following CSS variables:
    - `--paper_font_subhead_-_font_size` for the size.
    - `--primary-text-color` for the color.
4. Other task lines will now always use the following CSS variables:
    - `--paper_font_body1_-_font_size` for the size.
    - `--secondary-text-color` for the color.

## Known Issues
1. Add Task area is incomplete and setting the `show_add_task` flag to `true` causes the card to disappear. (Add Task card has errors from main branch)
2. Due/Completed dates with the time values 23:59:59 or 00:00:00 will not show the times. This is because those are the default values populated when no time is set.

---

Like my work and want to say thanks? Do it here:

<a href="https://www.buymeacoffee.com/iq1f96D" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/purple_img.png" alt="Buy Me A Coffee" style="height: auto !important;width: auto !important;" ></a>

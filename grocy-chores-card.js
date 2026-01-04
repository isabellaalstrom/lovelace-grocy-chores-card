import {html, LitElement, nothing} from "lit";
import {DateTime} from "luxon";
import style from './style.js';

class GrocyChoresCard extends LitElement {

    async loadCustomCreateTaskElements() {
        if(!customElements.get("ha-date-input") || !customElements.get("ha-textfield")) {
            const cardHelpers = await window.loadCardHelpers();
            if(!customElements.get("ha-date-input")) {
              await cardHelpers.importMoreInfoControl("date");
            }
            if(!customElements.get("ha-textfield")) {
              await cardHelpers.importMoreInfoControl("text");
            }
        }
    }

    async loadRescheduleElements() {
        if(!customElements.get("ha-dialog") || !customElements.get("ha-time-input")) {
            const cardHelpers = await window.loadCardHelpers();
            if(!customElements.get("ha-dialog")) {
                await cardHelpers.importMoreInfoDialog();
            }
            if(!customElements.get("ha-time-input")) {
                await cardHelpers.importMoreInfoControl("time");
            }
        }
    }

    static get styles() {
        return style;
    }

    _needUpdate(hass) {
        const oldHass = this._hass;
        if(oldHass == null) {
            return true;
        }
        let entities = [].concat(this.config.entity);
        for(let i=0; i<entities.length; i++) {
            let e = entities[i];
            if(e in hass.states) {
                if(!e in oldHass.states) {
                    return true;
                }
                if(hass.states[e] != oldHass.states[e]) {
                    return true;
                }
            }
        }
    }

    set hass(hass) {
        let update = this._needUpdate(hass);
        this._hass = hass;
        if(update) {
            this._processItems();
        }
    }


    _processItems() {
        let hass = this._hass;
        let allItems = [];
        this.entities = [];
        this.entities_not_found = [];
        if(!hass) {
            return;
        }
        if (Array.isArray(this.config.entity)) {
            for (let i = 0; i < this.config.entity.length; ++i) {
                this.entities[i] = this.config.entity[i] in hass.states ? hass.states[this.config.entity[i]] : null;
                if(this.entities[i] == null) {
                    this.entities_not_found.push(this.config.entity[i]);
                }
            }
        } else {
            this.entities[0] = this.config.entity in hass.states ? hass.states[this.config.entity] : null;
            if(this.entities[0] == null) {
              this.entities_not_found.push(this.config.entity);
            }
        }

        this.header = this.config.title == null ? "Todo" : this.config.title;

        this._configSetup();

        if (!Array.isArray(this.entities)) {
            this.requestUpdate();
            return;
        }

        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            let items;

            if(!entity) {
                continue;
            }

            if (entity.state === 'unknown') {
                console.warn("The Grocy sensor " + entity.entity_id + " is unknown.");
                continue;
            }

            items = this._getTasks(entity);
            if (items == null) {
                items = this._getChores(entity);
                if (items == null) continue;
            }

            allItems.push(items);
        }

        if (allItems.length === 0) {
            this.requestUpdate();
            return;
        }

        allItems = allItems.flat(1).filter(function (x) {
            return x !== undefined;
        });

        if (!this.custom_sort) {
            allItems.sort(function (a, b) {
                if (a.__due_date == null && b.__due_date == null) {
                    return 0; // Both are null, maintain current order
                }
                if (a.__due_date == null) {
                    return 1; // Place `null` at the end
                }
                if (b.__due_date == null) {
                    return -1; // Place `null` at the end
                }
                return a.__due_date - b.__due_date; // Sort by due_date
            });
        } else {
            let sort = [].concat(this.custom_sort);
            sort = sort.filter(x=>x);
            for(let i=0; i< sort.length; i++) {
                if(typeof sort[i] === "object") {
                    let d = sort[i].direction;
                    sort[i] = {field: sort[i].field ?? "",
                               direction: typeof d === "string" && d.startsWith("d") ? -1 : 1};
                }
                if(typeof sort[i] === "string") {
                    sort[i] = {field: sort[i], direction: 1};
                }
            }
            sort = sort.filter(x=>x.field !== "");
            allItems.sort(function (a, b) {
                for(let i=0; i< sort.length; i++) {
                    let f = sort[i].field;
                    let dir = sort[i].direction;
        
                    if (a[f] == null && b[f] == null) {
                        continue; // Both are null, maintain current order
                    }
                    if (a[f] == null) {
                        return 1 * dir; // Place null at the end
                    }
                    if (b[f] == null) {
                        return -1 * dir; // Place null at the end
                    }
                    if (a[f] < b[f]) {
                        return -1 * dir;
                    }
                    if (a[f] > b[f]) {
                        return 1 * dir;
                    }
                }
                return 0;
            });
        }

        this.itemsNotVisible = 0;
        this.overflow = [];
        if (this.show_quantity != null) {
            this.items = allItems.slice(0, this.show_quantity);
            if (this.show_overflow) {
                this.overflow = allItems.slice(this.show_quantity);
            } else {
                this.itemsNotVisible = allItems.length - this.items.length;
            }
        } else {
            this.items = allItems;
        }

        this.requestUpdate();
    }

    static getStubConfig() {
        return {
            entity: ["sensor.grocy_chores", "sensor.grocy_tasks"],
            title: "Todo",
            show_quantity: 5,
            show_assigned: true,
            show_overflow: true,
            show_chores_without_due: true,
            show_tasks_without_due: true,
            use_icons: true,
            use_long_date: true,
            due_in_days_threshold: 7,
            use_24_hours: true,
            hide_text_with_no_data: true,
            show_unassigned: false,
        }
    }

    static getConfigElement() {
        return document.createElement("content-card-editor");
    }

    setConfig(config) {
        if (!config.entity) {
            throw new Error('Please define entity');
        }
        this.config = config;
        this._processItems();
        if(this.config.show_create_task) {
            this.loadCustomCreateTaskElements();
        }
        if(this.config.show_enable_reschedule) {
            this.loadRescheduleElements();
        }
        if(this.config.show_more_info_popup) {
            this.loadRescheduleElements();
        }

    }

    render() {
        if (!this.entities) {
            return this._renderEntityNotFound();
        }
        for (let i = 0; i < this.entities_not_found.length; i++) {
            return this._renderEntityNotFound(this.entities_not_found[i]);
        }

        if (this.items === undefined) {
            this.items = [];
            this.overflow = [];
            this.itemsNotVisible = 0;
        }

        if (this.items.length < 1 && !this.show_empty) {
            return;
        }

        return html`
            ${html`
                <ha-card>
                    <h1 class="card-header flex">
                        <div class="name">
                            ${this.header}
                        </div>
                        ${this.show_create_task ? this._renderAddTaskButton() : nothing}
                    </h1>
                    ${this.show_create_task ? this._renderAddTask() : nothing}
                    <div class="card-content">
                        ${this._renderItems(this.items)}
                    </div>
                    ${this.itemsNotVisible > 0 ? this._renderNrItemsInGrocy() : nothing}
                    ${this.overflow && this.overflow.length > 0 ? this._renderOverflow() : nothing}
                </ha-card>`}
            ${this.show_enable_reschedule ? this._renderRescheduleDialog() : nothing}
            ${this.show_more_info_popup ? this._renderDescriptionDialog() : nothing}
        `;
    }

    _renderOverflow() {
        return html`
            <div class="name more-items-title overflow-toggle show-class">
                <div>
                    <ha-button class="expand-button show-more-button"
                               @click=${() => this._toggleOverflow(this.renderRoot)}>
                        ${this._translate("{number} More Items", this.overflow.length)}
                        <ha-icon slot="trailingIcon" style="--mdc-icon-size: ${this.expand_icon_size}px;"
                                 .icon=${"mdi:chevron-down"}></ha-icon>
                    </ha-button>
                </div>
            </div>

            <div class="card-content card-overflow-content overflow-toggle hidden-class">
                ${this._renderItems(this.overflow)}
            </div>

            <div class="name more-items-title overflow-toggle hidden-class">
                <div>
                    <ha-button class="expand-button show-more-button"
                               @click=${() => this._toggleOverflow(this.renderRoot)}>
                        ${this._translate("Show Less")}
                        <ha-icon slot="trailingIcon"
                                 .icon=${"mdi:chevron-up"}></ha-icon>
                    </ha-button>
                </div>
            </div>
        `
    }

    _renderItems(cardCollection) {
        if (cardCollection && cardCollection.length > 0) {
            return html`
                ${cardCollection.map(item => this._renderItem(item))}
            `
        } else {
            return html`
                <div class="info flex">${this._translate("No todos")}!</div>
            `
        }
    }

    _renderItem(item) {
        return html`
            <div class="${this.show_divider ? "grocy-item-container" : "grocy-item-container-no-border"} ${this.local_cached_hidden_items.includes(`${item.__type}${item.id}`) ? "hidden-class" : "show-class"} info flex" id="${item.__type}${item.id}">
                <div>
                    ${this._renderItemName(item)}
                    ${this._renderItemDescription(item)}
                    ${this._shouldRenderDueInDays(item) ? this._renderDueInDays(item) : nothing}
                    ${this._shouldRenderAssignedToUser(item) ? this._renderAssignedToUser(item) : nothing}
                    ${this._shouldRenderLastTracked(item) ? this._renderLastTracked(item) : nothing}
                </div>
                <div class="action-buttons">
                    ${this.show_enable_reschedule && (item.__type === "chore" || item.__type === "task") ? this._renderRescheduleButton(item) : nothing}
                    ${this.show_skip_next && (item.__type === "chore" || item.__type === "task") ? this._renderSkipButton(item) : nothing}
                    ${this.show_track_button && item.__type === "chore" ? this._renderTrackChoreButton(item) : nothing}
                    ${this.show_track_button && item.__type === "task" ? this._renderTrackTaskButton(item) : nothing}
                </div>
            </div>
        `
    }

    _renderEntityNotFound(entity) {
        return html`
            <hui-warning>
                ${this._hass.localize("ui.panel.lovelace.warning.entity_not_found", "entity", entity ?? this.config.entity)}
                <br>
                ${this._translate(`Ensure you have the appropriate sensors enabled in your grocy integration.`)}
            </hui-warning>
        `
    }

    _renderNrItemsInGrocy() {
        return html`
            <div class="secondary not-showing">
                ${this._translate("Look in Grocy for {number} more items", this.itemsNotVisible)}
            </div>
        `
    }

    _shouldRenderAssignedToUser(item) {
        return this.show_assigned && item.assigned_to_name != null;
    }

    _renderAssignedToUser(item) {
        return html`
            <div class="secondary">
                ${this._translate("Assigned to")}:
                ${item.assigned_to_name}
            </div>
        `
    }

    _shouldRenderLastTracked(item) {
        return this.show_last_tracked && item.__type === "chore" && (!this.hide_text_with_no_data || item.__last_tracked_date != null);
    }

    _renderLastTracked(item) {
        return html`
            <div class="secondary">
                ${this._translate("Last tracked")}:
                ${this._formatLastTrackedDate(item.__last_tracked_date, item.__last_tracked_days, item.track_date_only) ?? "-"}
                ${this.show_last_tracked_by && item.last_done_by != null ? this._translate("by") + " " + item.last_done_by.display_name : nothing}
            </div>
        `
    }

    _shouldRenderDueInDays(item) {
        return !this.hide_text_with_no_data || item.__due_date != null;
    }

    _renderDueInDays(item) {
        return html`
            <div class="secondary">
                ${this._translate("Due")}:
                <span class=${this._dueHtmlClass(item.__due_in_days) ?? nothing}>${this._formatDueDate(item.__due_date, item.__due_in_days) ?? "-"}</span>
            </div>
        `
    }

    _renderItemName(item) {
        if (this.show_more_info_popup && (item.__type === "chore" || item.__type === "task")) {
            return html`
                <div class="primary" style="cursor: pointer;" @click=${() => this._openDescriptionDialog(item)}>
                    ${item.__filtered_name ?? item.name}
                </div>
            `
        }
        return html`
            <div class="primary">
                ${item.__filtered_name ?? item.name}
            </div>
        `
    }

    _renderItemDescription(item) {
        return item.__description ? html`
            <div class="secondary">
                ${item.__description}
            </div>
        ` : nothing;
    }



    _renderAddTaskButton() {
        return html`
            <mwc-button class="hide-button" @click=${() => this._toggleAddTask()}>
                <ha-icon icon="mdi:chevron-down" id="add-task-icon"></ha-icon>
                ${this._translate("Add task")}
            </mwc-button>
        `
    }

    _renderAddTask() {
        return html`
            <div id="add-task-row" class="add-row hidden-class">
                <mwc-button @click=${() => this._addTask()}>
                    <ha-icon class="add-icon" icon="mdi:plus"></ha-icon>
                </mwc-button>
                <ha-textfield
                        id="add-task"
                        class="add-input"
                        .placeholder=${this._translate("Task Name")}>
                </ha-textfield>
            </div>
            <div id="add-task-row2" class="add-row hidden-class">
                <ha-select id="add-task-category" style="padding: 5px;" .label=${this._translate("Task Category (Optional)")}>
                  <option value="" disabled selected></option>
                </ha-select>
                <ha-date-input
                        id="add-date"
                        class="add-input"
                        .locale=${this._hass.locale}
                        .label=${this._translate("Due Date (Optional)")}>
                </ha-date-input>
            </div>
        `
    }

    _renderTrackChoreButton(item) {
        if (this.chore_icon != null) {
            return html`
                <mwc-icon-button class="track-button"
                                 .label=${this._translate("Track")}
                                 @click=${() => this._trackChore(item)}>
                    <ha-icon class="track-button-icon" style="--mdc-icon-size: ${this.chore_icon_size}px;"
                             .icon=${this.chore_icon}></ha-icon>
                </mwc-icon-button>
            `
        }

        return html`
            <mwc-button
                    @click=${() => this._trackChore(item)}>
                ${this._translate("Track")}
            </mwc-button>
        `
    }

    _renderRescheduleButton(item) {
        const shouldUseIcon = this.use_icons !== false;
        const icon = shouldUseIcon ? 'mdi:calendar-clock' : null;
        
        if (icon != null) {
            return html`
                <mwc-icon-button class="reschedule-button"
                                 .label=${this._translate("Reschedule")}
                                 @click=${() => this._openRescheduleDialog(item)}>
                    <ha-icon class="reschedule-button-icon" style="--mdc-icon-size: ${this.chore_icon_size}px;"
                             .icon=${icon}></ha-icon>
                </mwc-icon-button>
            `
        }

        return html`
            <mwc-button
                    @click=${() => this._openRescheduleDialog(item)}>
                ${this._translate("Reschedule")}
            </mwc-button>
        `
    }

    _renderSkipButton(item) {
        const shouldUseIcon = this.use_icons !== false;
        const icon = shouldUseIcon ? 'mdi:skip-next-circle-outline' : null;
        
        if (icon != null) {
            return html`
                <mwc-icon-button class="skip-button"
                                 .label=${this._translate("Skip")}
                                 @click=${() => this._skipItem(item)}>
                    <ha-icon class="skip-button-icon" style="--mdc-icon-size: ${this.chore_icon_size}px;"
                             .icon=${icon}></ha-icon>
                </mwc-icon-button>
            `
        }

        return html`
            <mwc-button
                    @click=${() => this._skipItem(item)}>
                ${this._translate("Skip")}
            </mwc-button>
        `
    }

    _renderTrackTaskButton(item) {
        if (this.task_icon != null) {
            return html`
                <mwc-icon-button class="track-checkbox"
                                 .label=${this._translate("Track")} @click=${() => this._trackTask(item.id, item.name)}>
                    <ha-icon class="track-button-icon" style="--mdc-icon-size: ${this.task_icon_size}px;"
                             .icon=${this.task_icon}></ha-icon>
                </mwc-icon-button>
            `
        }

        return html`
            <mwc-button
                    @click=${() => this._trackTask(item.id, item.name)}>
                ${this._translate("Track")}
            </mwc-button>
        `
    }

    _calculateDaysTillNow(date) {
        const now = DateTime.now();
        return date.startOf('day').diff(now.startOf('day'), 'days').days;
    }

    _dueHtmlClass(dueInDays) {
        if (dueInDays == null) {
            return null;
        } else if (dueInDays < 0) {
            return "overdue";
        } else if (dueInDays < 1) {
            return "due-today";
        } else {
            return "not-due";
        }
    }

    _formatDueDate(dueDate, dueInDays) {
        if (dueInDays < 0) {
            return this._translate("Overdue");
        } else if (dueInDays < 1) {
            return this._translate("Today");
        } else if (dueInDays < 2) {
            return this._translate("Tomorrow");
        } else if (dueInDays < this.due_in_days_threshold) {
            return this._translate("In {number} days", dueInDays);
        } else {
            return this._formatDate(dueDate, true);
        }
    }

    _formatLastTrackedDate(lastTrackedDate, lastTrackedDays, dateOnly) {
        if (lastTrackedDays < 1) {
            return this._translate("Today");
        } else if (lastTrackedDays < 2) {
            return this._translate("Yesterday");
        } else if (lastTrackedDays < this.last_tracked_days_threshold) {
            return this._translate("{number} days ago", lastTrackedDays);
        } else {
            return this._formatDate(lastTrackedDate, dateOnly);
        }
    }

    _translate(string, number) {
        let newString = string;
        if ((this.config.custom_translation != null) && (this.config.custom_translation[string] != null)) {
            newString = this.config.custom_translation[string];
        }
        if(number != null) {
            newString = newString.replace("{number}", number.toString());
        }
        return newString;
    }

    _formatDate(dateTime, isDateOnly = false) {
        if (dateTime == null) {
            return null;
        }

        let dateOptions;
        let timeOptions = {};
        if (this.config.use_long_date) {
            dateOptions = {month: 'long', day: 'numeric', year: 'numeric'};
        } else {
            dateOptions = {month: 'numeric', day: 'numeric', year: 'numeric'};
        }

        if (!isDateOnly) {
            timeOptions = {hour: 'numeric', minute: 'numeric', hour12: !this.config.use_24_hours};
        }

        const dateTimeFormatOptions = {...dateOptions, ...timeOptions};
        return dateTime.toLocaleString(dateTimeFormatOptions);
    }

    _toDateTime(date) {
        return DateTime.fromISO(date);
    }

    _isItemVisible(item) {
        let visible = false;
        
        if(item.__due_in_days == null) {
            visible = true;
            visible = visible && (item.__type === "chore" ? this.show_chores_without_due : true);
            visible = visible && (item.__type === "task" ? this.show_tasks_without_due : true);
        } else {
            visible = visible || this.show_days == null;

            if(this.show_days != null) {
                const days_range = typeof this.show_days === "number" ? [this.show_days] : this.show_days.split("..", 2);
                if(days_range.length === 1) {
                    visible = visible || (item.__due_in_days <= days_range[0]);
                } else {
                    visible = visible || ((item.__due_in_days <= days_range[1]) && (item.__due_in_days >= days_range[0]));
                }
            }
        }

        visible = visible && (this.filter !== undefined ? this._checkMatchNameFilter(item) : true);
        
        // Handle user filter and show_unassigned logic
        if (this.filter_user !== undefined) {
            // If filter_user is set, show items matching the filter OR unassigned items (if show_unassigned is true)
            const isUnassigned = this._isUnassigned(item);
            const matchesUserFilter = this._checkMatchUserFilter(item);
            const shouldShow = matchesUserFilter || (this.show_unassigned && isUnassigned);
            visible = visible && shouldShow;
        } else {
            // If filter_user is not set, show_unassigned controls whether to show unassigned items
            if (this.show_unassigned === false) {
                // If show_unassigned is false, hide unassigned items (only show assigned items)
                const isUnassigned = this._isUnassigned(item);
                visible = visible && !isUnassigned;
            }
            // If show_unassigned is true or undefined, show all items (default behavior - no filtering)
        }

        if(item.__type === "task" && this.filter_task_category !== undefined) {
            visible = visible && this._checkMatchTaskCategoryFilter(item);
        }

        return visible;
    }

    _checkMatchNameFilter(item) {
        let filter = [].concat(this.filter);
        let match = filter.some(e => item.name.includes(e)); // Item name matches any filter value
        if(!match) {
            return false;
        }

        if (this.remove_filter) {
            item.__filtered_name = item.name;
            for(let i=0; i<filter.length; i++) {
                item.__filtered_name = item.__filtered_name.replace(filter[i], "");
            }
        }

        return true;
    }

    _checkMatchUserFilter(item) {
        let userArray = [].concat(this.filter_user).map((user) => user === "current" ? this._getUserId() : user);;
        return userArray.some((user) => item.__user_id == user);
    }

    _isUnassigned(item) {
        // Check if assigned_to_name is null/undefined, which determines if "Assigned to:" is shown
        // This works for both chores and tasks
        return item.assigned_to_name == null;
    }

    _checkMatchTaskCategoryFilter(item) {
        let filter = [].concat(this.filter_task_category);
        return filter.some(id => item.category_id === id);
    }

    _formatItemDescription(item) {
        let d = null;
        if(this.show_description && item.description) {
            d = item.description;
            if(this.description_max_length && (d.length > this.description_max_length)) {
                d = d.substring(0, this.description_max_length) + "...";
            }
        }
        item.__description = d;
    }

    _getTasks(entity) {
        if (entity.attributes.tasks === undefined) {
            return null;
        }

        let items = JSON.parse(JSON.stringify(entity.attributes.tasks));
        if (items === undefined) {
            return null;
        }

        const tasks = [];
        items.map(item => {
            item.__type = "task";
            
            if (item.assigned_to_user) {
                item.__user_id = item.assigned_to_user.id;
                item.assigned_to_name = item.assigned_to_user.display_name;
            } else if (item.assigned_to_user_id) {
                // Handle case where assigned_to_user_id is provided directly
                item.__user_id = item.assigned_to_user_id;
                // Note: assigned_to_name will remain null/undefined in this case
            }
            
            if (item.due_date != null) {
                item.__due_date = this._toDateTime(item.due_date);
                item.__due_in_days = this._calculateDaysTillNow(item.__due_date);
            }

            this._formatItemDescription(item);

            if (this._isItemVisible(item)) {
                tasks.push(item);
            }

        });

        return tasks;
    }

    _getChores(entity) {
        if (entity.attributes.chores === undefined) {
            return null;
        }

        let items = JSON.parse(JSON.stringify(entity.attributes.chores));
        if (items === undefined) {
            return null;
        }

        const chores = [];
        items.map(item => {
            item.__type = "chore";
            if (item.next_execution_assigned_user) {
                item.__user_id = item.next_execution_assigned_user.id;
                item.assigned_to_name = item.next_execution_assigned_user.display_name;
            }

            if (item.next_estimated_execution_time != null && item.next_estimated_execution_time.slice(0, 4) !== 2999) {
                item.__due_date = this._toDateTime(item.next_estimated_execution_time);
                item.__due_in_days = this._calculateDaysTillNow(item.__due_date);
            }

            if (item.last_tracked_time) {
                item.__last_tracked_date = this._toDateTime(item.last_tracked_time);
                item.__last_tracked_days = Math.abs(this._calculateDaysTillNow(item.__last_tracked_date));
            }

            this._formatItemDescription(item);

            if (this._isItemVisible(item)) {
                chores.push(item);
            }

        });

        return chores;
    }

    _getUserId() {
        if(typeof this.userId === "object") {
            return this.userId[this._hass?.user?.name] ?? this.userId.default ?? 1;
        } else {
            return this.userId ?? 1;
        }
    }

    _trackChore(item) {
        // Hide the chore on the next render, for better visual feedback
        this.local_cached_hidden_items.push(`chore${item.id}`);
        this.requestUpdate();
        
        // Determine user ID: if filter_user is enabled, chore is unassigned, and filter_user is a single value, use it
        let userId;
        if (this.filter_user !== undefined && this._isUnassigned(item)) {
            // Check if filter_user is a single value (not an array)
            if (!Array.isArray(this.filter_user)) {
                // Single value - use it (handle "current" special case)
                userId = this.filter_user === "current" ? this._getUserId() : this.filter_user;
            } else {
                // It's an array, use normal logic
                userId = this._getUserId();
            }
        } else {
            userId = this._getUserId();
        }
        
        this._hass.callService("grocy", "execute_chore", {
            chore_id: item.id, done_by: userId
        });
        this._showTrackedToast(item.name);
    }

    _trackTask(taskId, taskName) {
        // Hide the task on the next render, for better visual feedback
        this.local_cached_hidden_items.push(`task${taskId}`);
        this.requestUpdate();
        this._hass.callService("grocy", "complete_task", {
            task_id: taskId
        });
        this._showTrackedToast(taskName);
    }

    async _openRescheduleDialog(item) {
        await this.loadRescheduleElements();
        this._rescheduleItem = item;
        // Default to current execution/due date, or current time if not set
        const defaultDate = item.__due_date || DateTime.now();
        this._rescheduleDate = defaultDate.toFormat("yyyy-LL-dd");
        // Only set time for chores (tasks don't have time)
        if (item.__type === "chore") {
            this._rescheduleTime = defaultDate.toFormat("HH:mm");
        } else {
            this._rescheduleTime = null;
        }
        this._rescheduleDialogOpen = true;
        this.requestUpdate();
    }

    _closeRescheduleDialog() {
        this._rescheduleDialogOpen = false;
        this._rescheduleItem = null;
        this.requestUpdate();
    }

    async _openDescriptionDialog(item) {
        await this.loadRescheduleElements(); // Reuse the same elements loader for ha-dialog
        this._descriptionItem = item;
        this._descriptionDialogOpen = true;
        this.requestUpdate();
    }

    _closeDescriptionDialog() {
        this._descriptionDialogOpen = false;
        this._descriptionItem = null;
        this.requestUpdate();
    }

    async _assignToMe() {
        // Prevent multiple simultaneous calls
        if (this._assigning) {
            return;
        }
        this._assigning = true;

        // Store item in local variable immediately to prevent it from being cleared
        const item = this._descriptionItem;
        if (!item) {
            this._assigning = false;
            return;
        }

        // Get the filtered user ID
        let userId;
        if (this.filter_user === "current") {
            userId = this._getUserId();
        } else {
            userId = this.filter_user;
        }

        try {
            if (item.__type === "chore") {
                // For chores: need to get original chore data and update assignment
                const grocyEntity = this.entities.find(e => e.attributes.chores);
                if (!grocyEntity) {
                    throw new Error("Grocy entity not found");
                }
                
                const originalChore = grocyEntity.attributes.chores?.find(c => c.id === item.id);
                if (!originalChore) {
                    throw new Error("Original chore data not found");
                }

                // For chores, we only need to update the assignment
                // Use existing rescheduled_date if available, otherwise use next_estimated_execution_time
                let rescheduledDate = originalChore.rescheduled_date;
                
                if (!rescheduledDate && originalChore.next_estimated_execution_time) {
                    // If no rescheduled_date, use next_estimated_execution_time
                    rescheduledDate = originalChore.next_estimated_execution_time;
                } 

                const chorePayload = {
                    rescheduled_date: rescheduledDate,
                    rescheduled_next_execution_assigned_to_user_id: String(userId),
                    next_execution_assigned_to_user_id: String(userId)
                };
                
                await this._hass.callService("grocy", "update_generic", {
                    entity_type: "chores",
                    object_id: item.id,
                    data: chorePayload
                });
            } else {
                // For tasks: need to include all original data plus updated assigned_to_user_id
                const grocyEntity = this.entities.find(e => e.attributes.tasks);
                if (!grocyEntity) {
                    throw new Error("Grocy entity not found");
                }
                
                const originalTask = grocyEntity.attributes.tasks?.find(t => t.id === item.id);
                if (!originalTask) {
                    throw new Error("Original task data not found");
                }

                // Build payload with all original data and updated assigned_to_user_id
                const categoryId = originalTask.category_id || (originalTask.category ? String(originalTask.category.id) : "");
                const taskData = {
                    name: originalTask.name || "",
                    description: originalTask.description || "",
                    category_id: categoryId,
                    assigned_to_user_id: String(userId),
                    due_date: originalTask.due_date || ""
                };

                await this._hass.callService("grocy", "update_generic", {
                    entity_type: "tasks",
                    object_id: item.id,
                    data: taskData
                });
            }

            // Close dialog first
            this._closeDescriptionDialog();
            
            // Show success message
            const itemType = item.__type === "chore" ? "Chore" : "Task";
            if (this.config.browser_mod) {
                this._hass.callService("browser_mod", "notification", {
                    message: this._translate(`${itemType} assigned`),
                    notification_id: "grocy-assign"
                }).catch(() => {
                    // Ignore errors
                });
            }
            
            // Simple refresh - let Home Assistant handle entity updates naturally
            this.requestUpdate();
            
            this._assigning = false;
        } catch (error) {
            this._assigning = false;
            const itemType = item ? (item.__type === "chore" ? "chore" : "task") : "item";
            const errorMessage = error.message || error.toString() || "Unknown error";
            alert(this._translate(`Failed to assign ${itemType}: `) + errorMessage);
        }
    }

    async _skipToNextDay() {
        if (!this._rescheduleItem) {
            return;
        }

        try {
            const isChore = this._rescheduleItem.__type === "chore";
            const tomorrow = DateTime.now().plus({ days: 1 });
            const tomorrowDateStr = tomorrow.toFormat('yyyy-MM-dd');

            if (isChore) {
                // For chores: use the current time from the reschedule dialog or default to current time
                const timeInput = this.shadowRoot.getElementById('reschedule-time');
                let timeStr = timeInput ? timeInput.value : null;
                
                // If no time set, use the current chore's execution time or current time
                if (!timeStr || !timeStr.trim()) {
                    if (this._rescheduleTime) {
                        timeStr = this._rescheduleTime;
                    } else {
                        const now = DateTime.now();
                        timeStr = now.toFormat('HH:mm');
                    }
                }
                
                // Format datetime string
                const timeParts = timeStr.split(':');
                let dateTimeStr;
                if (timeParts.length >= 2) {
                    dateTimeStr = `${tomorrowDateStr} ${timeParts[0]}:${timeParts[1]}:00`;
                } else {
                    dateTimeStr = `${tomorrowDateStr} 00:00:00`;
                }
                
                // Get original chore data to preserve assigned user
                const grocyEntity = this.entities.find(e => e.attributes.chores || e.attributes.tasks);
                let assignedUserId = "";
                if (grocyEntity) {
                    const originalChore = grocyEntity.attributes.chores.find(c => c.id === this._rescheduleItem.id);
                    if (originalChore && originalChore.next_execution_assigned_user) {
                        assignedUserId = String(originalChore.next_execution_assigned_user.id);
                    }
                }
                
                // Use Grocy service to update the chore
                await this._hass.callService("grocy", "update_generic", {
                    entity_type: "chores",
                    object_id: this._rescheduleItem.id,
                    data: {
                        rescheduled_date: dateTimeStr,
                        rescheduled_next_execution_assigned_to_user_id: assignedUserId
                    }
                });
            } else {
                // For tasks: need to include all original data plus updated due_date
                const grocyEntity = this.entities.find(e => e.attributes.tasks);
                if (!grocyEntity) {
                    throw new Error("Grocy entity not found");
                }
                
                const originalTask = grocyEntity.attributes.tasks.find(t => t.id === this._rescheduleItem.id);
                if (!originalTask) {
                    throw new Error("Original task data not found");
                }

                // Build payload with all original data and updated due_date
                const categoryId = originalTask.category_id || (originalTask.category ? String(originalTask.category.id) : "");
                const taskData = {
                    name: originalTask.name || "",
                    description: originalTask.description || "",
                    category_id: categoryId,
                    assigned_to_user_id: originalTask.assigned_to_user ? String(originalTask.assigned_to_user.id) : "",
                    due_date: tomorrowDateStr
                };

                // Use Grocy service to update the task
                await this._hass.callService("grocy", "update_generic", {
                    entity_type: "tasks",
                    object_id: this._rescheduleItem.id,
                    data: taskData
                });
            }

            this._closeRescheduleDialog();
            // Refresh the card by requesting an update
            this.requestUpdate();
            if (this.config.browser_mod) {
                const itemType = this._rescheduleItem.__type === "chore" ? "Chore" : "Task";
                this._hass.callService("browser_mod", "notification", {
                    message: this._translate(`${itemType} rescheduled to next day`),
                    notification_id: "grocy-reschedule"
                });
            }
        } catch (error) {
            console.error("Error skipping to next day:", error);
            const itemType = this._rescheduleItem.__type === "chore" ? "chore" : "task";
            alert(this._translate(`Failed to skip ${itemType} to next day: `) + (error.message || error));
        }
    }

    async _doReschedule() {
        if (!this._rescheduleItem) {
            return;
        }

        const dateStr = this.shadowRoot.getElementById('reschedule-date').value;

        if (!dateStr) {
            alert(this._translate("Date is required"));
            return;
        }

        try {
            if (this._rescheduleItem.__type === "chore") {
                // For chores: combine date and time into "YYYY-MM-DD HH:MM:SS"
                const timeInput = this.shadowRoot.getElementById('reschedule-time');
                const timeStr = timeInput ? timeInput.value : null;
                // ha-time-input returns "HH:MM" format, we need to add seconds
                let dateTimeStr;
                if (timeStr && timeStr.trim()) {
                    // Remove any existing seconds if present and add :00
                    const timeParts = timeStr.split(':');
                    if (timeParts.length >= 2) {
                        // Take only HH:MM and add :00 for seconds
                        dateTimeStr = `${dateStr} ${timeParts[0]}:${timeParts[1]}:00`;
                    } else {
                        dateTimeStr = `${dateStr} 00:00:00`;
                    }
                } else {
                    dateTimeStr = `${dateStr} 00:00:00`;
                }
                
                // Get original chore data to preserve assigned user
                const grocyEntity = this.entities.find(e => e.attributes.chores || e.attributes.tasks);
                let assignedUserId = "";
                if (grocyEntity) {
                    const originalChore = grocyEntity.attributes.chores.find(c => c.id === this._rescheduleItem.id);
                    if (originalChore && originalChore.next_execution_assigned_user) {
                        assignedUserId = String(originalChore.next_execution_assigned_user.id);
                    }
                }
                
                // Use Grocy service to update the chore
                await this._hass.callService("grocy", "update_generic", {
                    entity_type: "chores",
                    object_id: this._rescheduleItem.id,
                    data: {
                        rescheduled_date: dateTimeStr,
                        rescheduled_next_execution_assigned_to_user_id: assignedUserId
                    }
                });
            } else {
                // For tasks: need to include all original data plus updated due_date
                // Get original task data from entity
                const grocyEntity = this.entities.find(e => e.attributes.tasks);
                if (!grocyEntity) {
                    throw new Error("Grocy entity not found");
                }
                
                const originalTask = grocyEntity.attributes.tasks.find(t => t.id === this._rescheduleItem.id);
                if (!originalTask) {
                    throw new Error("Original task data not found");
                }

                // Build payload with all original data and updated due_date
                // category_id might be in category.id or directly as category_id
                const categoryId = originalTask.category_id || (originalTask.category ? String(originalTask.category.id) : "");
                const taskData = {
                    name: originalTask.name || "",
                    description: originalTask.description || "",
                    category_id: categoryId,
                    assigned_to_user_id: originalTask.assigned_to_user ? String(originalTask.assigned_to_user.id) : "",
                    due_date: dateStr || ""
                };

                // Use Grocy service to update the task
                await this._hass.callService("grocy", "update_generic", {
                    entity_type: "tasks",
                    object_id: this._rescheduleItem.id,
                    data: taskData
                });
            }

            this._closeRescheduleDialog();
            // Refresh the card by requesting an update
            this.requestUpdate();
            if (this.config.browser_mod) {
                const itemType = this._rescheduleItem.__type === "chore" ? "Chore" : "Task";
                this._hass.callService("browser_mod", "notification", {
                    message: this._translate(`${itemType} rescheduled`),
                    notification_id: "grocy-reschedule"
                });
            }
        } catch (error) {
            console.error("Error rescheduling item:", error);
            const itemType = this._rescheduleItem.__type === "chore" ? "chore" : "task";
            alert(this._translate(`Failed to reschedule ${itemType}: `) + (error.message || error));
        }
    }

    _shouldShowAssignToMe() {
        // Only show if:
        // 1. show_more_info_popup is enabled
        // 2. disable_show_assign_to_me is not true
        // 3. filter_user is a single value (not array)
        // 4. Item is unassigned
        if (!this.show_more_info_popup) {
            return false;
        }
        if (this.disable_show_assign_to_me) {
            return false;
        }
        if (!this._descriptionItem) {
            return false;
        }
        if (!this._isUnassigned(this._descriptionItem)) {
            return false;
        }
        if (this.filter_user === undefined || Array.isArray(this.filter_user)) {
            return false;
        }
        return true;
    }

    _renderDescriptionDialog() {
        if (!this._descriptionDialogOpen || !this._descriptionItem) {
            return nothing;
        }

        const description = this._descriptionItem.description;
        const hasDescription = description != null && description.trim() !== "";
        const displayText = hasDescription ? description : this._translate("No description found.");
        const showAssignButton = this._shouldShowAssignToMe();

        return html`
            <ha-dialog
                open
                .heading=${this._descriptionItem.__filtered_name ?? this._descriptionItem.name}
                @closed=${() => this._closeDescriptionDialog()}>
                <div style="white-space: pre-line; padding: 16px 0;">
                    ${displayText}
                </div>
                ${showAssignButton ? html`
                    <ha-button 
                        slot="secondaryAction" 
                        @click=${() => this._assignToMe()}
                        outlined>
                        ${this._translate("Assign to me")}
                    </ha-button>
                ` : nothing}
                <ha-button 
                    slot="primaryAction" 
                    @click=${() => this._closeDescriptionDialog()}
                    raised>
                    ${this._translate("OK")}
                </ha-button>
            </ha-dialog>
        `;
    }

    _renderRescheduleDialog() {
        if (!this._rescheduleDialogOpen || !this._rescheduleItem) {
            return nothing;
        }

        const isChore = this._rescheduleItem.__type === "chore";
        const heading = isChore ? this._translate("Reschedule Chore") : this._translate("Reschedule Task");

        return html`
            <ha-dialog
                open
                .heading=${heading}
                @closed=${() => this._closeRescheduleDialog()}>
                <div>
                    <!-- Skip to next day button -->
                    <div style="margin-bottom: 16px;">
                        <ha-button 
                            @click=${() => this._skipToNextDay()}
                            raised
                            style="width: 100%;">
                            <ha-icon icon="mdi:skip-next-circle-outline" style="margin-right: 8px;"></ha-icon>
                            ${this._translate("Skip to next day")}
                        </ha-button>
                    </div>
                    
                    <!-- Divider with OR -->
                    <div style="display: flex; align-items: center; margin: 16px 0;">
                        <div style="flex: 1; height: 1px; background-color: var(--divider-color, rgba(0,0,0,0.12));"></div>
                        <span style="margin: 0 16px; color: var(--secondary-text-color);">${this._translate("OR")}</span>
                        <div style="flex: 1; height: 1px; background-color: var(--divider-color, rgba(0,0,0,0.12));"></div>
                    </div>
                    
                    <!-- Date and time pickers -->
                    <ha-date-input
                        id="reschedule-date"
                        .locale=${this._hass.locale}
                        .label=${this._translate("Date")}
                        .value=${this._rescheduleDate}>
                    </ha-date-input>
                    ${isChore ? html`
                        <ha-time-input
                            id="reschedule-time"
                            .locale=${this._hass.locale}
                            .label=${this._translate("Time")}
                            .value=${this._rescheduleTime}
                            .format=${this.use_24_hours ? 24 : 12}>
                        </ha-time-input>
                    ` : nothing}
                </div>
                <ha-button 
                    slot="primaryAction" 
                    @click=${() => this._doReschedule()}
                    raised>
                    ${this._translate("Reschedule")}
                </ha-button>
                <ha-button 
                    slot="secondaryAction" 
                    @click=${() => this._closeRescheduleDialog()}
                    outlined>
                    ${this._translate("Cancel")}
                </ha-button>
            </ha-dialog>
        `;
    }

    async _skipItem(item) {
        try {
            if (item.__type === "chore") {
                // Use Grocy service to execute chore with skipped flag
                // The service will handle tracked_time automatically (uses next_estimated_execution_time when skipped)
                await this._hass.callService("grocy", "execute_chore", {
                    chore_id: item.id,
                    done_by: this._getUserId(),
                    skipped: true
                });
            } else {
                // For tasks: Skip to next day
                // Calculate next day: next day of task's due date OR next day of today if task is in the past
                let nextDay;
                if (item.__due_date) {
                    const taskDate = item.__due_date;
                    const today = DateTime.now().startOf('day');
                    const taskDateOnly = taskDate.startOf('day');
                    
                    if (taskDateOnly >= today) {
                        // Task is today or in the future, skip to next day after task date
                        nextDay = taskDateOnly.plus({ days: 1 });
                    } else {
                        // Task is in the past, skip to next day after today
                        nextDay = today.plus({ days: 1 });
                    }
                } else {
                    // No due date, skip to next day after today
                    nextDay = DateTime.now().startOf('day').plus({ days: 1 });
                }

                const nextDayStr = nextDay.toFormat("yyyy-LL-dd");

                // Get original task data to preserve all fields
                const grocyEntity = this.entities.find(e => e.attributes.tasks);
                if (!grocyEntity) {
                    throw new Error("Grocy entity not found");
                }
                
                const originalTask = grocyEntity.attributes.tasks.find(t => t.id === item.id);
                if (!originalTask) {
                    throw new Error("Original task data not found");
                }

                // Build payload with all original data and updated due_date
                const categoryId = originalTask.category_id || (originalTask.category ? String(originalTask.category.id) : "");
                const taskData = {
                    name: originalTask.name || "",
                    description: originalTask.description || "",
                    category_id: categoryId,
                    assigned_to_user_id: originalTask.assigned_to_user ? String(originalTask.assigned_to_user.id) : "",
                    due_date: nextDayStr
                };

                // Use Grocy service to update the task
                await this._hass.callService("grocy", "update_generic", {
                    entity_type: "tasks",
                    object_id: item.id,
                    data: taskData
                });
            }

            // Hide the item on the next render, for better visual feedback
            this.local_cached_hidden_items.push(`${item.__type}${item.id}`);
            this.requestUpdate();

            // Refresh the card by requesting an update
            this.requestUpdate();
            if (this.config.browser_mod) {
                const itemType = item.__type === "chore" ? "Chore" : "Task";
                this._hass.callService("browser_mod", "notification", {
                    message: this._translate(`${itemType} skipped`),
                    notification_id: "grocy-skip"
                });
            }
        } catch (error) {
            console.error("Error skipping item:", error);
            const itemType = item.__type === "chore" ? "chore" : "task";
            alert(this._translate(`Failed to skip ${itemType}: `) + (error.message || error));
        }
    }

    _showTrackedToast(itemName) {
        this._showToast(itemName, this._translate("Tracked"));
    }

    _showAddedToast(itemName) {
        this._showToast(itemName, this._translate("Added"));
    }

    _showToast(itemName, action) {
        if (this.config.browser_mod) {
            this._hass.callService("browser_mod", "notification", {
                message: `${this._translate(action)} "${itemName}".`, duration: 3000
            });
        }
        this._fireHaptic();
    }
    
    _fireHaptic() {
        if (this.haptic != null) {
            const myevent = new Event("haptic", {bubbles: true, composed: true, cancelable: false});
            myevent.detail = this.haptic;
            window.dispatchEvent(myevent);
        }
    }

    _toggleOverflow(documentFragment) {
        let element;
        const elementsHidden = documentFragment.querySelectorAll('.hidden-class.overflow-toggle');
        const elementsShown = documentFragment.querySelectorAll('.show-class.overflow-toggle');

        for (element in elementsHidden) {
            if (elementsHidden.hasOwnProperty(element)) {
                elementsHidden[element].classList.remove("hidden-class");
                elementsHidden[element].classList.add("show-class");
            }
        }
        for (element in elementsShown) {
            if (elementsShown.hasOwnProperty(element)) {
                elementsShown[element].classList.remove("show-class");
                elementsShown[element].classList.add("hidden-class");
            }
        }
    }

    _populateTaskCategory(){
        let hass = this._hass;
        this.entities = [];
        this.entities_not_found = [];
        if(!hass) {
            return;
        }
        if (Array.isArray(this.config.entity)) {
            for (let i = 0; i < this.config.entity.length; ++i) {
                this.entities[i] = this.config.entity[i] in hass.states ? hass.states[this.config.entity[i]] : null;
                if(this.entities[i] == null) {
                    this.entities_not_found.push(this.config.entity[i]);
                }
            }
        } else {
            this.entities[0] = this.config.entity in hass.states ? hass.states[this.config.entity] : null;
            if(this.entities[0] == null) {
              this.entities_not_found.push(this.config.entity);
            }
        }
        if (!Array.isArray(this.entities)) {
            this.requestUpdate();
            return;
        }
  
        for (let i = 0; i < this.entities.length; i++) {
            let entity = this.entities[i];
            let items;
  
            if(!entity) {
                continue;
            }
  
            if (entity.state === 'unknown') {
                console.warn("The Grocy sensor " + entity.entity_id + " is unknown.");
                continue;
            }
  
            if (entity.attributes.tasks === undefined) {
              return null;
            }
  
            let items1 = JSON.parse(JSON.stringify(entity.attributes.tasks));
            if (items1 === undefined) {
              return null;
            }
  
            const tasks = [];
            items1.map(item => {
                item.__type = "task";
                
                if (item.assigned_to_user) {
                    item.__user_id = item.assigned_to_user.id;
                    item.assigned_to_name = item.assigned_to_user.display_name;
                } else if (item.assigned_to_user_id) {
                    // Handle case where assigned_to_user_id is provided directly
                    item.__user_id = item.assigned_to_user_id;
                    // Note: assigned_to_name will remain null/undefined in this case
                }
                
                if (item.due_date != null) {
                    item.__due_date = this._toDateTime(item.due_date);
                    item.__due_in_days = this._calculateDaysTillNow(item.__due_date);
                }
  
                this._formatItemDescription(item);
  
                if (this._isItemVisible(item)) {
                    tasks.push(item);
                }
  
            });
            const categories = {};
            entity.attributes.tasks.forEach(task => {
              const { id, name } = task.category;
              categories[id] = name; // Use id as key to ensure uniqueness
            });
  
            // Reference to the dropdown
            const dropdown = this.shadowRoot.getElementById('add-task-category');
            dropdown.innerHTML="";
  
            // Populate the dropdown
            Object.entries(categories).forEach(([id, name]) => {
              const option = this.shadowRoot.createElement('ha-list-item');
              option.value = id;  // Set the value to category ID
              option.textContent = name;  // Set the text to category name
              dropdown.appendChild(option);
            });
  
         }
      }

    _toggleAddTask() {
        const addTaskRow = this.shadowRoot.getElementById("add-task-row");
        const addTaskRow2 = this.shadowRoot.getElementById("add-task-row2");
        const addTaskIcon = this.shadowRoot.getElementById("add-task-icon");
        if (addTaskRow.classList.contains('hidden-class')) {
            addTaskRow.classList.remove('hidden-class');
            addTaskRow2.classList.remove('hidden-class');
            addTaskIcon.icon = "mdi:chevron-up";
        } else {
            addTaskRow.classList.add('hidden-class');
            addTaskRow2.classList.add('hidden-class');
            addTaskIcon.icon = "mdi:chevron-down";
        }
        this._populateTaskCategory();
    }

    _addTask() {
        const taskName = this.shadowRoot.getElementById('add-task').value;
        const taskDueDate = this.shadowRoot.getElementById('add-date').value;
        const taskCategory = this.shadowRoot.getElementById('add-task-category').value;
        let taskData = {};
        if (!taskName) {
            alert(this._translate("'Name' can't be empty"));
            return;
        }

        taskData["name"] = taskName;
        if (taskDueDate) {
            let parsedDate = DateTime.fromFormat(taskDueDate, "yyyy-LL-dd");
            if (!parsedDate.isValid) {
                alert(this._translate("Due date must be empty or a valid date in format yyyy-mm-dd"));
                return;
            }

            taskData["due_date"] = taskDueDate;
        }
        taskData["category_id"] = taskCategory;
        taskData["assigned_to_user_id"] = this._getUserId();

        this._hass.callService("grocy", "add_generic", {
            entity_type: "tasks", data: taskData
        });

        this.shadowRoot.getElementById('add-task').value = "";
        this.shadowRoot.getElementById('add-task-category').value = "";
        this.shadowRoot.getElementById('add-date').value = "";

        this._showAddedToast(taskName);
    }

    _configSetup() {
        this.userId = this.config.user_id ?? 1;
        this.filter = this.config.filter;
        this.filter_user = this.config.filter_user;
        this.filter_task_category = this.config.filter_task_category;
        this.remove_filter = this.config.remove_filter ?? false;
        this.show_quantity = this.config.show_quantity || null;
        this.show_days = this.config.show_days ?? null;
        this.show_chores_without_due = this.config.show_chores_without_due ?? true;
        this.show_tasks_without_due = this.config.show_tasks_without_due ?? true;
        this.show_assigned = this.config.show_assigned ?? true;
        this.show_track_button = this.config.show_track_button ?? true;
        this.show_last_tracked = this.config.show_last_tracked ?? true;
        this.show_last_tracked_by = this.config.show_last_tracked_by ?? true;
        this.filter_category = this.config.filter_category ?? null;
        this.show_category = this.config.show_category ?? true;
        this.show_description = this.config.show_description ?? false;
        this.show_empty = this.config.show_empty ?? true;
        this.show_create_task = this.config.show_create_task ?? false;
        this.show_overflow = this.config.show_overflow || false;
        this.chore_icon_size = this.config.chore_icon_size || 32;
        this.task_icon_size = this.config.task_icon_size || 24;
        this.expand_icon_size = this.config.expand_icon_size || 30;
        this.show_divider = this.config.show_divider ?? false;
        this.due_in_days_threshold = this.config.due_in_days_threshold || 0;
        this.last_tracked_days_threshold = this.config.last_tracked_days_threshold || 0;
        this.hide_text_with_no_data = this.config.hide_text_with_no_data ?? false;
        this.use_long_date = this.config.use_long_date ?? false;
        this.use_24_hours = this.config.use_24_hours ?? true;
        this.haptic = this.config.haptic ?? "selection";
        this.task_icon = null
        this.chore_icon = null
        this.custom_sort = this.config.custom_sort;
        this.fixed_tiling_size = this.config.fixed_tiling_size ?? null;
        this.use_icons = this.config.use_icons ?? false;
        this.show_unassigned = this.config.show_unassigned ?? false;
        this.show_enable_reschedule = this.config.show_enable_reschedule ?? false;
        this.show_skip_next = this.config.show_skip_next ?? false;
        this.show_more_info_popup = this.config.show_more_info_popup ?? false;
        this.disable_show_assign_to_me = this.config.disable_show_assign_to_me ?? false;
        if (this.use_icons) {
            this.task_icon = this.config.task_icon || 'mdi:checkbox-blank-outline';
            this.chore_icon = this.config.chore_icon || 'mdi:check-circle-outline';
        }
        if(this.show_description) {
            this.description_max_length = this.config.description_max_length ?? null;
        }
    }


    constructor() {
        super();
        this.local_cached_hidden_items = [];
        this._rescheduleDialogOpen = false;
        this._rescheduleItem = null;
        this._rescheduleDate = null;
        this._rescheduleTime = null;
        this._descriptionDialogOpen = false;
        this._descriptionItem = null;
    }

    getCardSize() {
        if(this.fixed_tiling_size != null) {
            return this.fixed_tiling_size;
        }
        //an item seems to be about 70-80 pixels, depending on options, and a 'unit' of size is 50 pixels. 
        if(Array.isArray(this.items)) {
            return Math.floor(this.items.length * 3 / 2) || 1;
        } else {
            return 3;
        }
    }
}

// Configure the preview in the Lovelace card picker
window.customCards = window.customCards || [];
window.customCards.push({
    type: 'grocy-chores-card',
    name: 'Grocy Chores and Tasks Card',
    preview: false,
    description: 'A card used to display chores and/or tasks from the Grocy custom component.',
    documentationURL: 'https://github.com/isabellaalstrom/lovelace-grocy-chores-card'
});

customElements.define('grocy-chores-card', GrocyChoresCard);

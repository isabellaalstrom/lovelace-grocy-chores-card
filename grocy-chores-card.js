import { html, LitElement } from "https://unpkg.com/lit?module";

  class GrocyChoresCard extends LitElement {
    static getConfigElement() {
      return document.createElement("content-card-editor");
    }
  
    static getStubConfig() {
      return { entity: "sensor.grocy_chores",
              title: null,
              show_quantity: null,
              show_days: null,
              show_assigned: true,
              show_last_tracked: true,
              show_last_tracked_by: true,
              show_track_button: true,
              browser_mod: false,
              show_overflow: false, /** When true, replaces the 'Look in Grocy for X more items' text with a 'Show X more' button that toggles an overflow area. */
              show_divider: false, /** When true, shows a divider between each task. Uses the CSS variable 'entities-divider-color' with fallback to 'divider-color' from your theme. */
              use_icons: null, /** When null, uses icons for chores/tasks only when chore_icon or task_icon is set. When true, forces defaults if chore_icon/task_icon is not set. When false, overrides chore_icon/task_icon and always uses text buttons. */
              task_icon: null, /** Sets the icon used on Tasks. Replaces the text. Set "use_icons" to true and don't use this parameter to use default icon. */
              task_icon_size: 24, /** Sets the size of the icon for Tasks. Default is 24 because default is an empty checkbox. Only applies when use_icon or task_icon is set. */
              chore_icon: null, /** Sets the icon used on Chores. Replaces the text. Set "use_icons" to true and don't use this parameter to use default icon. */
              chore_icon_size: 32, /** Sets the size of the icon for Chores. Default is 32. Only applies when use_icon or chore_icon is set. */
              expand_icon_size: 30, /** Sets the size of the expand/collapse button on the Overflow area. Default is 30. Only applies when use_icon or show_overflow is set. */
              use_long_date: false, /** Sets if the Due/Completed dates are formatted in long format (i.e. December 31, 2022) or short format (i.e. 12/31/2022). Uses localization settings for token order. */
              due_in_days_threshold: 0, /** Due dates are reported as 'Overdue', 'Today', 'Tomorrow', 'In X Days', and finally using the actual date. This sets how many days use the 'In X Days' format before it switches to using date notation. */
              use_24_hours: true, /** Sets if the times are shown in 12 hour or 24 hour formats. */
              hide_text_with_no_data: false, /** When true, if a property for an item is not set, it hides the text. For example, if a chore has never been completed, instead of showing 'Last tracked: -', it will hide the 'Last tracked' row entirely. */
            }
    }

    setConfig(config) {
      if (!config.entity) {
        throw new Error('Please define entity');
      }
      this.config = config;
    }
    
    calculateDueDate(dueDate){
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      var today = new Date();
      today.setHours(0,0,0,0)

      var splitDate = dueDate.split(/[- :T]/)
      var parsedDueDate = new Date(splitDate[0], splitDate[1]-1, splitDate[2]);
      parsedDueDate.setHours(0,0,0,0)
      
      var dueInDays;
      if(today > parsedDueDate) {
        dueInDays = -1;
      }
      else
        dueInDays = Math.round(Math.abs((today.getTime() - parsedDueDate.getTime())/(oneDay)));

      return dueInDays;
    }

    checkDueClass(dueInDays) {
      if (dueInDays == 0)
        return "due-today";
      else if (dueInDays < 0)
        return "overdue";
      else
        return "not-due";
    }

    formatDueDate(dueDate, dueInDays) {
      if (dueInDays < 0)
        return this.translate("Overdue");
      else if (dueInDays == 0)
        return this.translate("Today");
      else if (dueInDays == 1)
        return this.translate("Tomorrow");
      else if (dueInDays <= this.config.due_in_days_threshold)
        return this.translate("In {number} Days").replace("{number}", dueInDays);
      else
        return this._formatDate(dueDate);
    }

    translate(string) {
      if((this.config.custom_translation != null) &&
          (this.config.custom_translation[string] != null))
          {
             return this.config.custom_translation[string];
          }
      return string;
    }
  
    render(){
      if (!this.entities)
      {
        return html`
        <hui-warning>
          ${this._hass.localize("ui.panel.lovelace.warning.entity_not_found",
            "entity",
            this.config.entity
          )}
        </hui-warning>
        `
      }

      if(this.items == undefined)
      {
        this.items = [];
        this.notShowing = [];
        this.overflow = [];
      }

      if(this.items.length < 1 && this.show_empty == false)
      {
        return "";
      }

      return html
      `
        ${this._renderStyle()}
        ${html
          `<ha-card>
            <h1 class="card-header flex">
              <div class="name">
                ${this.header}
              </div>
              ${this.show_create_task ? html
                `<mwc-button class="hide-button" @click=${ev => this._toggleAddTask()}><ha-icon icon="mdi:chevron-down"></ha-icon> Add task</mwc-button>`
              : ""}
            </h1>
            ${this.show_create_task ? html
              `
                <div style="display: none;" id="add-task-row" class="add-row">
                  <mwc-button @click=${ev => this._addTask()}><ha-icon class="add-icon" icon="mdi:plus"></ha-icon></mwc-button>
                  <paper-input
                    id="add-task"
                    class="add-input"
                    no-label-float
                    placeholder=${this.translate("Add task")}>
                  </paper-input>
                  <paper-input
                    id="add-date"
                    class="add-input"
                    no-label-float
                    placeholder=${this.translate("Optional due date/time")}
                    value="${this._formatDate()}">
                  </paper-input>
                </div>
              `
            : ""}
            <div class="card-content">
              ${this.items.length > 0 ? this._getItemListHtml(this.items, true) : html`<div class="info flex">${this.translate("No todos")}!</div>`}
            </div>
            ${this.notShowing.length > 0 && this.notShowing.length != null ? html
              `
              <div class="secondary not-showing">
              ${this.translate("Look in Grocy for {number} more items").replace("{number}", this.notShowing.length)}
              </div>
              `
              : ""}
            ${this.overflow.length > 0 && this.overflow.length != null ? html
              `
            <div class="name more-items-title show-class">
              <div>
                <ha-button class="expand-button show-more-button" @click=${ev => this._toggleOverflow(this.renderRoot)}>
                  <div slot="icon" style="width: 100%;">
                    <span class="mdc-button__label">${this.translate("{number} More Items").replace("{number}", this.overflow.length)}</span>
                  </div>
                  <div slot="trailingIcon">
                    <ha-icon slot="trailingIcon" .icon=${"mdi:chevron-down"} ></ha-icon>
                  </div>
                </ha-button>
              </div>
            </div>
              
            <div class="card-content card-overflow-content hidden-class">
              ${this.overflow.length > 0 ? this._getItemListHtml(this.overflow, false) : html`<div class="info flex">${this.translate("No todos")}!</div>`}
            </div>

            <div class="name more-items-title hidden-class">
              <div>
                <ha-button class="expand-button show-more-button" @click=${ev => this._toggleOverflow(this.renderRoot)}>
                  <div slot="icon" style="width: 100%;">
                    <span class="mdc-button__label">${this.translate("Show Less")}</span>
                  </div>
                  <div slot="trailingIcon">
                    <ha-icon slot="trailingIcon" .icon=${"mdi:chevron-up"} ></ha-icon>
                  </div>
                </ha-button>
              </div>
            </div>
              `
              : ""}
          </ha-card>`}
      `;            
    } 

    _getItemListHtml(cardCollection, hideFirstDivider){
      return html`
                ${cardCollection.map(item =>
                  html`
                  <div class="grocy-item-container${hideFirstDivider ? "" : "-force-border" } info flex">
                    <div>
                      <div class="primary">
                        ${item._filtered_name != null ? item._filtered_name : item.name}
                      </div>

                      ${this.hide_text_with_no_data == false || item.next_estimated_execution_time != null ? html
                        `
                        <div class="secondary">
                          ${this.translate("Due")}: <span class="${item.next_estimated_execution_time != null ? this.checkDueClass(item.dueInDays) : ""}">${item.next_estimated_execution_time != null ? this.formatDueDate(item.next_estimated_execution_time, item.dueInDays) : "-"}</span>
                        </div>
                        `
                      : ""}
                      ${this.show_assigned == true && item.next_execution_assigned_user != null ? html
                        `
                        <div class="secondary">
                            ${this.translate("Assigned to")}: ${item.next_execution_assigned_user.display_name}
                        </div>
                        `
                      : ""}
                      ${this.show_last_tracked == true ? html
                      `
                        ${item.type == "chore" ? html
                        `
                        ${this.hide_text_with_no_data == false || item.last_tracked_time != null ? html
                          `
                          <div class="secondary">
                            ${this.translate("Last tracked")}: ${item.last_tracked_time != null ? this._formatDate(item.last_tracked_time) : "-"}
                            ${this.show_last_tracked_by == true && item.last_done_by != null ? this.translate("by") + " " + item.last_done_by.display_name : ""}
                          </div>
                          `
                        : ""}
                        `
                        : ""
                        }

                      `
                      : ""}
                    </div>
                    ${this.show_track_button == true ? html
                    `
                      ${item.type == "chore" ? html
                      `
                      <div>
                        ${this.chore_icon != null ? html 
                          `
                          <mwc-icon-button class="track-button" .label=${this.translate("Track")} @click=${ev => this._trackChore(item.id, item.name)}><ha-icon class="track-button-icon" .icon=${this.chore_icon} ></ha-icon></mwc-icon-button>
                          ` : html 
                          `
                        <mwc-button @click=${ev => this._trackChore(item.id, item.name)}>${this.translate("Track")}</mwc-button>
                          ` }
                        
                      </div>
                      `
                      : html
                      `
                      <div>
                        ${this.task_icon != null ? html 
                          `
                          <mwc-icon-button class="track-checkbox" .label=${this.translate("Track")} @click=${ev => this._trackTask(item.id, item.name)}><ha-icon class="track-button-icon" .icon=${this.task_icon} ></ha-icon></mwc-icon-button>
                          ` : html 
                          `
                        <mwc-button @click=${ev => this._trackTask(item.id, item.name)}>${this.translate("Track")}</mwc-button>
                          ` }
                        
                      </div>
                      `}
                    `
                    : ""}

                  </div>`
              )}`
    } 

    _formatDate(){
      var currentdate = new Date();
      return _formatDate(currentdate);
    }

    _formatDate(currentdatestr){

      var currentdate = new Date(currentdatestr);

      if(this.config.use_long_date){
        if((currentdate.getHours() == 0 && currentdate.getMinutes() == 0 && currentdate.getSeconds() == 0) || (currentdate.getHours() == 23 && currentdate.getMinutes() == 59 && currentdate.getSeconds() == 59)){
          const options = { month: 'long', day: 'numeric', year: 'numeric' };
          return new Intl.DateTimeFormat('default', options).format(currentdate);
        }else{
          const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: (this.config.use_24_hours == false) };
          return new Intl.DateTimeFormat('default', options).format(currentdate);
        }
      }else{
        if((currentdate.getHours() == 0 && currentdate.getMinutes() == 0 && currentdate.getSeconds() == 0) || (currentdate.getHours() == 23 && currentdate.getMinutes() == 59 && currentdate.getSeconds() == 59)){
          const options = { month: 'numeric', day: 'numeric', year: 'numeric' };
          return new Intl.DateTimeFormat('default', options).format(currentdate);
        }else{
          const options = { month: 'numeric', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: (this.config.use_24_hours == false) };
          return new Intl.DateTimeFormat('default', options).format(currentdate);
        } 
      }
    }

    _trackChore(choreId, choreName){
      this._hass.callService("grocy", "execute_chore", {
        chore_id: choreId,
        done_by: this.userId
      });
      this._showToast(choreName);
    }

    _trackTask(taskId, taskName){
      this._hass.callService("grocy", "complete_task", {
        task_id: taskId
      });
      this._showToast(taskName);
    }

    _showToast(name){
      if(this.config.browser_mod != null && this.config.browser_mod === true)
      {
        this._hass.callService("browser_mod", "toast", {
          message: `${this.translate("Tracked")} "${name}".`,
          duration: 3000
        });
      }
    }

    _toggleOverflow(documentFragment){
      var elementsHidden = documentFragment.querySelectorAll('.hidden-class');
      var elementsShown = documentFragment.querySelectorAll('.show-class');

      for (var i in elementsHidden) {
        if (elementsHidden.hasOwnProperty(i)) {
          elementsHidden[i].classList.remove("hidden-class");
          elementsHidden[i].classList.add("show-class");
        }
      }
      for (var i in elementsShown) {
        if (elementsShown.hasOwnProperty(i)) {
          elementsShown[i].classList.remove("show-class");
          elementsShown[i].classList.add("hidden-class");
        }
      }
    }

    _toggleAddTask(){
      console.log("toggling");
      var x = this.shadowRoot.getElementById("add-task-row");
      if (x.style.display === "none") {
        x.style.display = "flex";
      } else {
        x.style.display = "none";
      }
    }

    _addTask(){
      var taskName = this.shadowRoot.getElementById('add-task').value;
      var taskDueDate = this.shadowRoot.getElementById('add-date').value;
      if(taskName == null || taskName == "")
      {
        alert(this.translate("'Name' can't be empty"));
      }
      else if(taskDueDate == null) {
        this._hass.callService("grocy", "add_generic", {
          entity_type: "tasks",
          data: { "name": taskName }
        });
        console.log("Adding task: " + taskName)
      }
      else {
        this._hass.callService("grocy", "add_generic", {
          entity_type: "tasks",
          data: { "name": taskName, "due_date": taskDueDate }
        });
        console.log("Adding task: " + taskName + ", due: " + taskDueDate)
      }
    }

    _renderStyle() {
        return html
        `
          <style>
            .info {
              padding-bottom: 1em;
            }
            .flex {
              display: flex;
              justify-content: space-between;
            }
            .card-content {
              padding-bottom: 0px;
            }
            .overdue {
              color: var(--red, red) !important;
            }
            .due-today {
              color: var(--orange, orange) !important;
            }
            .not-showing {
              margin-left: 16px;
              padding-bottom: 16px;
            }
            .primary {
              display: block;
              color: var(--primary-text-color, #8c96a5);
              font-size: var(--paper-font-subhead_-_font-size);
            }
            .secondary {
              display: block;
              color: var(--secondary-text-color, #8c96a5);
              font-size: var(--paper-font-body1_-_font-size);
            }
            .add-row {
              margin-top: -16px;
              padding-bottom: 16px;
              display: flex;
              flex-direction: row;
              align-items: center;
              width: 100%;
            }
            .add-input {
              padding-right: 16px;
              width: 100%;
            }
            .hide-button {
              padding: 0 0 16px 16px;
            }
            .grocy-item-container, .grocy-item-container-force-border {
              border-top: ${this.show_divider ? 1 : 0 }px solid var(--entities-divider-color, var(--divider-color, transparent)); 
              padding-top: 12px;
              align-items: center;
            }
            .grocy-item-container:first-child {
              border-top: none;
            }
            .expand-button {
              --mdc-ripple-color: none; 
              --mdc-icon-size: ${this.expand_icon_size > 0 ? this.expand_icon_size : 30 }px; 
              width: ${this.expand_icon_size > 0 ? this.expand_icon_size : 30 }px;
            }
            .track-button {
              --mdc-ripple-color: none; 
              --mdc-icon-size: ${this.chore_icon_size > 0 ? this.chore_icon_size : 32 }px; 
              width: ${this.chore_icon_size > 0 ? ((this.chore_icon_size - 48) / 2) + 48 : 48 }px; /* I know this is bad. Not sure wht the width is 48px to begin with, though, so it needs to do this to align correctly. */
            }
            .track-checkbox {
              --mdc-ripple-color: none; 
              --mdc-icon-size: ${this.task_icon_size > 0 ? this.task_icon_size : 24 }px; 
              width: ${this.task_icon_size > 0 ? ((this.task_icon_size - 48) / 2) + 48 : 48 }px; /* I know this is bad. Not sure wht the width is 48px to begin with, though, so it needs to do this to align correctly. */
            }
            .more-items-title {
              padding: 6px 16px 6px 16px;
              width: calc(100% - 32px);
              margin-top: -8px;
            }
            .show-more-button{
              width: 100%;
              display: flex;
              justify-content: space-between;
              cursor: pointer;
              font-size: var(--paper-font-subhead_-_font-size);
              line-height: calc(var(--paper-font-subhead_-_font-size) + 20px);
            }
            .show-more-button:hover{
              color: var(--accent-color)
            }
            .track-button-icon {
              color: var(--primary-text-color);
            }
            .track-button-icon:hover {
              color: var(--green, var(--active-color, green));
            }
            .card-overflow-content {
              
            }
            .hidden-class {
              display: none;
            }
            .show-class {
              
            }
            .card-overflow-content {
              margin-top: 0px;
            }

          </style>
        `;
      }

      _configSetup(){
        this.userId = this.config.user_id == null ? 1 : this.config.user_id;
        this.filter = this.config.filter == null ? null : this.config.filter;
        this.filter_user = this.config.filter_user == null ? null : this.config.filter_user;
        this.remove_filter = this.config.remove_filter == null ? false : this.config.remove_filter;
        this.show_quantity = this.config.show_quantity == null || this.config.show_quantity == 0 || this.config.show_quantity == '' ? null : this.config.show_quantity;
        this.show_days = this.config.show_days === null || this.config.show_days === '' ? null : this.config.show_days;
        this.show_assigned = this.config.show_assigned == null ? true : this.config.show_assigned;
        this.show_track_button = this.config.show_track_button == null ? true : this.config.show_track_button;
        this.show_last_tracked = this.config.show_last_tracked == null ? true : this.config.show_last_tracked;
        this.show_last_tracked_by = this.config.show_last_tracked_by == null ? true : this.config.show_last_tracked_by;
        this.filter_category = this.config.filter_category == null ? null : this.config.filter_category;
        this.show_category = this.config.show_category == null ? true : this.config.show_category;
        this.show_description = this.config.show_description == null ? true : this.config.show_description;
        this.show_empty = this.config.show_empty == null ? true : this.config.show_empty;
        this.show_create_task = this.config.show_create_task == null ? false : this.config.show_create_task;
        this.show_overflow = this.config.show_overflow === null || this.config.show_overflow === '' ? false : this.config.show_overflow;
        this.chore_icon_size = this.config.chore_icon_size == null || this.config.chore_icon_size == 0 || this.config.chore_icon_size == '' ? 32 : this.config.chore_icon_size;
        this.task_icon_size = this.config.task_icon_size == null || this.config.task_icon_size == 0 || this.config.task_icon_size == '' ? 24 : this.config.task_icon_size;
        this.expand_icon_size = this.config.expand_icon_size == null || this.config.expand_icon_size == 0 || this.config.expand_icon_size == '' ? 30 : this.config.expand_icon_size;
        this.show_divider = this.config.show_divider == null ? false : this.config.show_divider;
        this.due_in_days_threshold = this.config.due_in_days_threshold == null || this.config.due_in_days_threshold == '' ? 0 : this.config.due_in_days_threshold;
        this.hide_text_with_no_data = this.config.hide_text_with_no_data == null ? false : this.config.hide_text_with_no_data;
        this.use_long_date = this.config.use_long_date == null ? false : this.config.use_long_date;
        this.use_24_hours = this.config.use_24_hours == null ? true : this.config.use_24_hours;
        if(this.use_icons == null) {
          this.task_icon = this.config.task_icon == null || this.config.task_icon == '' ? null : this.config.task_icon;
          this.chore_icon = this.config.chore_icon == null || this.config.chore_icon == '' ? null : this.config.chore_icon;
        }
        else if(this.use_icons) {
          this.task_icon = this.config.task_icon == null || this.config.task_icon == '' ? 'mdi:checkbox-blank-outline' : this.config.task_icon;
          this.chore_icon = this.config.chore_icon == null || this.config.chore_icon == '' ? 'mdi:check-circle-outline' : this.config.chore_icon;
        }
        else {
          this.task_icon = null
          this.chore_icon = null
        }
        this.use_icons = this.config.use_icons == null ? null : this.config.use_icons;
      }

    set hass(hass) {
      this._hass = hass;
      this.entities = new Array();
      if(Array.isArray(this.config.entity))
      {      
        for (var i = 0; i < this.config.entity.length; ++i) {
          this.entities[i] = this.config.entity[i] in hass.states ? hass.states[this.config.entity[i]] : null;
        }
      }
      else {
        this.entities[0] = this.config.entity in hass.states ? hass.states[this.config.entity] : null;
      }

      this.header = this.config.title == null ? "Todo" : this.config.title;
      
      this._configSetup();

      if (this.entities) {
        var allItems = [];
        var finalItemsList = [];

        for (var i = 0; i < this.entities.length; ++i) {
          var items;
          if (this.entities[i].state == 'unknown')
          {
            console.warn("The Grocy sensor " + this.entities[i].entity_id + " is unknown.");
          }
          else {
            if (this.entities[i].attributes.chores != undefined || this.entities[i].attributes.chores != null) {
              items = this.entities[i].attributes.chores;
              if(items != undefined)
                items.map(item =>{
                  item.type = "chore"
                });
            }
            else {
              items = this.entities[i].attributes.tasks;
              if(items != undefined)
              {
                items.map(item =>{
                  item.type = "task"
                });
              }
            }
            if (items != null){
              if (this.filter != null) {
                var filteredItems = [];
                for (let i = 0; i < items.length; i++) {
                  if (items[i].name.includes(this.filter)) {
                    if (this.remove_filter) {
                      items[i]._filtered_name = items[i].name.replace(this.filter, '');
                    }
                    filteredItems.push(items[i]);
                  }
                }
                items = filteredItems;
              }
      
              if (this.filter_user != null) {
                var filteredItems = [];
                
                if (items[i].type === "chore") {
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].next_execution_assigned_user != null && items[i].next_execution_assigned_user.id == this.filter_user) {
                      filteredItems.push(items[i]);
                    }
                  }
                } else {
                  for (let i = 0; i < items.length; i++) {
                    if (items[i].assigned_to_user_id != null && items[i].assigned_to_user_id == this.filter_user) {
                      filteredItems.push(items[i]);
                    }
                  }
                }

                items = filteredItems;
              }

              allItems.push(items);
            }
          }
        }
        if(allItems.length > 0)
        {
          allItems = allItems[0].concat(allItems[1])
          allItems = allItems.filter(function(x) {
            return x !== undefined;
          });
          allItems.map(item =>{
            if(item.next_estimated_execution_time == null && item.due_date != null)
            {
              item.next_estimated_execution_time = item.due_date;
            }
          });

          allItems.sort(function(a,b){
            if (a.next_estimated_execution_time == null || a.next_estimated_execution_time == undefined || a.next_estimated_execution_time == "-")
            {
              return -1;
            }
            if (b.next_estimated_execution_time == null || b.next_estimated_execution_time == undefined || b.next_estimated_execution_time == "-")
            {
              return 1;
            }
            if (a.next_estimated_execution_time != null && b.next_estimated_execution_time != null) {
              var aSplitDate = a.next_estimated_execution_time.split(/[- :T]/)
              var bSplitDate = b.next_estimated_execution_time.split(/[- :T]/)
    
              var aParsedDueDate = new Date(aSplitDate[0], aSplitDate[1]-1, aSplitDate[2]);
              var bParsedDueDate = new Date(bSplitDate[0], bSplitDate[1]-1, bSplitDate[2]);
    
              return aParsedDueDate - bParsedDueDate;
            }
            return 0;
          })
          
          allItems.map(item =>{
            var dueInDays = item.next_estimated_execution_time ? this.calculateDueDate(item.next_estimated_execution_time) : 10000;
            item.dueInDays = dueInDays;
            if(this.show_days != null) {
              if(dueInDays <= this.show_days){
                finalItemsList.push(item);
              }
              else if(item.next_estimated_execution_time != null && item.next_estimated_execution_time.slice(0,4) == "2999") {
                item.next_estimated_execution_time = "-";
                finalItemsList.unshift(item)
              }
            }
            else {
              if(item.next_estimated_execution_time == null || dueInDays == 10000 || item.next_estimated_execution_time.slice(0,4) == "2999"){
                item.next_estimated_execution_time = "-";
                finalItemsList.unshift(item)
              }
              else
              finalItemsList.push(item);
            }
          })
          
          if(this.show_quantity != null) {
            this.items = finalItemsList.slice(0, this.show_quantity);
            if(this.show_overflow) {
              this.overflow = finalItemsList.slice(this.show_quantity);
              this.notShowing = 0;
            }
            else {
            this.notShowing = finalItemsList.slice(this.show_quantity);
              this.overflow = 0;
            }            
          }
          else {
            this.items = finalItemsList;
            this.notShowing = 0;
            this.overflow = 0;
          }
        }
      }
      this.requestUpdate();
    }
    
    // @TODO: This requires more intelligent logic
    getCardSize() {
      return 3;
    }
  }
      
  // Configure the preview in the Lovelace card picker
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'grocy-chores-card',
    name: 'Grocy Chores and Tasks Card',
    preview: false,
    description: 'A card used to display chores and/or tasks from the Grocy custom component.',
  });
  
  customElements.define('grocy-chores-card', GrocyChoresCard);

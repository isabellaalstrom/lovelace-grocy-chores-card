customElements.whenDefined('card-tools').then(() => {
  let cardTools = customElements.get('card-tools');
    
  class GrocyChoresCard extends cardTools.LitElement {
    static getConfigElement() {
      return document.createElement("content-card-editor");
    }
  
    static getStubConfig() {
      return { entity: "sensor.grocy_chores", title: null, show_quantity: null, show_days: null, show_assigned: true, show_last_tracked: true, show_last_tracked_by: true, show_track_button: true }
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
      else
        return dueDate.substr(0, 10);
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
      return cardTools.LitHtml`
      <hui-warning>
        ${this._hass.localize("ui.panel.lovelace.warning.entity_not_found",
          "entity",
          this.config.entity
        )}
      </hui-warning>
      `
      return cardTools.LitHtml
      `
        ${this._renderStyle()}
        ${cardTools.LitHtml
          `<ha-card>
            <div class="header">
              <div class="name">
                ${this.header}
              </div>
            </div>
            <div>
              ${this.items.length > 0 ? cardTools.LitHtml`
              ${this.items.map(item =>
                cardTools.LitHtml`
                <div class="info flex">
                  <div>
                    ${item._filtered_name != null ? item._filtered_name : item.name}
                    <div class="secondary">
                      ${this.translate("Due")}: <span class="${item.next_estimated_execution_time != null ? this.checkDueClass(item.dueInDays) : ""}">${item.next_estimated_execution_time != null ? this.formatDueDate(item.next_estimated_execution_time, item.dueInDays) : "-"}</span>
                    </div>
                    ${this.show_assigned == true && item.next_execution_assigned_user != null ? cardTools.LitHtml
                      `
                      <div class="secondary">
                          ${this.translate("Assigned to")}: ${item.next_execution_assigned_user.display_name}
                      </div>
                      `
                    : ""}
                    ${this.show_last_tracked == true ? cardTools.LitHtml
                      `
                    <div class="secondary">
                      ${this.translate("Last tracked")}: ${item.last_tracked_time != null ? item.last_tracked_time.substr(0, 10) : "-"}
                      ${this.show_last_tracked_by == true && item.last_done_by != null ? this.translate("by") + " " + item.last_done_by.display_name : ""}
                    </div>
                    `
                    : ""}
                  </div>
                  ${this.show_track_button == true ? cardTools.LitHtml
                  `
                  <div>
                    <mwc-button @click=${ev => this._track(item.id)}>${this.translate("Track")}</mwc-button>
                  </div>     
                  `
                  : ""}

                </div>`
              )}` : cardTools.LitHtml`<div class="info flex">${this.translate("No todos")}!</div>`}
            </div>
            ${this.notShowing.length > 0 && this.notShowing.length != null ? cardTools.LitHtml
              `
              <div class="secondary">
                  ${this.translate("Look in Grocy for {number} more items").replace("{number}", this.notShowing.length)}
              </div>
              `
            : ""}
          </ha-card>`}
      `;
    } 

    _track(choreId){
      this._hass.callService("grocy", "execute_chore", {
        chore_id: choreId,
        done_by: this.userId
      });
    }

    _renderStyle() {
        return cardTools.LitHtml
        `
          <style>
            ha-card {
              padding: 16px;
            }
            .header {
              padding: 0;
              @apply --paper-font-headline;
              line-height: 40px;
              color: var(--primary-text-color);
              padding: 4px 0 12px;
            }
            .info {
              padding-bottom: 1em;
            }
            .flex {
              display: flex;
              justify-content: space-between;
            }
            .overdue {
              color: red !important;
            }
            .due-today {
              color: orange !important;
            }
            .secondary {
              display: block;
              color: #8c96a5;
          }
          </style>
        `;
      }
    
      _setupTasks(){

      }

      _setupChores(){

      }

      _configSetup(){
        this.userId = this.config.user_id == null ? 1 : this.config.user_id;
        this.filter = this.config.filter == null ? null : this.config.filter;
        this.filter_user = this.config.filter_user == null ? null : this.config.filter_user;
        this.remove_filter = this.config.remove_filter == null ? false : this.config.remove_filter;
        this.show_quantity = this.config.show_quantity == null || this.config.show_quantity == 0 || this.config.show_quantity == '' ? null : this.config.show_quantity;
        this.show_days = this.config.show_days == null || this.config.show_days == 0 || this.config.show_days == '' ? null : this.config.show_days;
        this.show_assigned = this.config.show_assigned == null ? true : this.config.show_assigned;
        this.show_track_button = this.config.show_track_button == null ? true : this.config.show_track_button;
        this.show_last_tracked = this.config.show_last_tracked == null ? true : this.config.show_last_tracked;
        this.show_last_tracked_by = this.config.show_last_tracked_by == null ? true : this.config.show_last_tracked_by;
        this.filter_category = this.config.filter_category == null ? null : this.config.filter_category;
        this.show_category = this.config.show_category == null ? true : this.config.show_category;
        this.show_description = this.config.show_description == null ? true : this.config.show_description;
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
        var finishedItemsList = [];

        for (var i = 0; i < this.entities.length; ++i) {
          var items;
          if (this.entities[i].state == 'unknown')
          {
            console.error("The Grocy sensor " + this.entities[i].entity_id + " is unknown.");
            return;
          }
          else {
            if (this.entities[i].attributes.chores != undefined || this.entities[i].attributes.chores != null) {
              items = this.entities[i].attributes.chores;
            }
            else {
              items = this.entities[i].attributes.tasks;
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
                for (let i = 0; i < items.length; i++) {
                  if (items[i].next_execution_assigned_user != null && items[i].next_execution_assigned_user.id == this.filter_user) {
                    filteredItems.push(items[i]);
                  }
                }
                items = filteredItems;
              }

              allItems.push(items);
            }
          }
        }
        allItems = allItems[0].concat(allItems[1])
        allItems.map(item =>{
          if(item.next_estimated_execution_time == null && item.due_date != null)
          {
            item.next_estimated_execution_time = item.due_date;
          }
        });

        console.log(allItems);
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
              finishedItemsList.push(item);
            }
            else if(item.next_estimated_execution_time != null && item.next_estimated_execution_time.slice(0,4) == "2999") {
              item.next_estimated_execution_time = "-";
              finishedItemsList.unshift(item)
            }
          }
          else {
            if(item.next_estimated_execution_time == null || dueInDays == 10000 || item.next_estimated_execution_time.slice(0,4) == "2999"){
              item.next_estimated_execution_time = "-";
              finishedItemsList.unshift(item)
            }
            else
            finishedItemsList.push(item);
          }
        })
        
        if(this.show_quantity != null) {
          this.items = finishedItemsList.slice(0, this.show_quantity);
          this.notShowing = finishedItemsList.slice(this.show_quantity);
        }
        else {
          this.items = finishedItemsList;
          this.notShowing = 0;
        }
      }

      this.requestUpdate();
    }
    
    // @TODO: This requires more intelligent logic
    getCardSize() {
      return 3;
    }
  }
  
  customElements.define('grocy-chores-card', GrocyChoresCard);

  // Configure the preview in the Lovelace card picker
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: 'grocy-chores-card',
    name: 'Grocy Chores Card',
    preview: false,
    description: 'A card used to display chores information from the Grocy custom component.',
    });
  });
  
  window.setTimeout(() => {
    if(customElements.get('card-tools')) return;
    customElements.define('grocy-chores-card', class extends HTMLElement{
      setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
    });
  }, 2000);

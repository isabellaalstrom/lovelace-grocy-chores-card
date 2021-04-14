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
      if (!this.entity)
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
              ${this.chores.length > 0 ? cardTools.LitHtml`
              ${this.chores.map(chore =>
                cardTools.LitHtml`
                <div class="info flex">
                  <div>
                    ${chore._filtered_name != null ? chore._filtered_name : chore.name}
                    <div class="secondary">
                      ${this.translate("Due")}: <span class="${chore.next_estimated_execution_time != null ? this.checkDueClass(chore.dueInDays) : ""}">${chore.next_estimated_execution_time != null ? this.formatDueDate(chore.next_estimated_execution_time, chore.dueInDays) : "-"}</span>
                    </div>
                    ${this.show_assigned == true && chore.next_execution_assigned_user != null ? cardTools.LitHtml
                      `
                      <div class="secondary">
                          ${this.translate("Assigned to")}: ${chore.next_execution_assigned_user.display_name}
                      </div>
                      `
                    : ""}
                    ${this.show_last_tracked == true ? cardTools.LitHtml
                      `
                    <div class="secondary">
                      ${this.translate("Last tracked")}: ${chore.last_tracked_time != null ? chore.last_tracked_time.substr(0, 10) : "-"}
                      ${this.show_last_tracked_by == true && chore.last_done_by != null ? this.translate("by") + " " + chore.last_done_by.display_name : ""}
                    </div>
                    `
                    : ""}
                  </div>
                  ${this.show_track_button == true ? cardTools.LitHtml
                  `
                  <div>
                    <mwc-button @click=${ev => this._track(chore.id)}>${this.translate("Track")}</mwc-button>
                  </div>     
                  `
                  : ""}

                </div>`
              )}` : cardTools.LitHtml`<div class="info flex">${this.translate("No chores")}!</div>`}
            </div>
            ${this.notShowing.length > 0 && this.notShowing.length != null ? cardTools.LitHtml
              `
              <div class="secondary">
                  ${this.translate("Look in Grocy for {number} more chores").replace("{number}", this.notShowing.length)}
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
    
    set hass(hass) {
      this._hass = hass;
      
      this.entity = this.config.entity in hass.states ? hass.states[this.config.entity] : null;

      this.header = this.config.title == null ? "Chores" : this.config.title;
      this.userId = this.config.user_id == null ? 1 : this.config.user_id;

      this.show_quantity = this.config.show_quantity == null || this.config.show_quantity == 0 || this.config.show_quantity == '' ? null : this.config.show_quantity;
      this.show_days = this.config.show_days === null || this.config.show_days === '' ? null : this.config.show_days;

      this.filter = this.config.filter == null ? null : this.config.filter;
      this.filter_user = this.config.filter_user == null ? null : this.config.filter_user;
      this.remove_filter = this.config.remove_filter == null ? false : this.config.remove_filter;

      this.show_assigned = this.config.show_assigned == null ? true : this.config.show_assigned;
      this.show_last_tracked = this.config.show_last_tracked == null ? true : this.config.show_last_tracked;
      this.show_last_tracked_by = this.config.show_last_tracked_by == null ? true : this.config.show_last_tracked_by;

      this.show_track_button = this.config.show_track_button == null ? true : this.config.show_track_button;

      if (this.entity) {
        if (this.entity.state == 'unknown')
          throw new Error("The Grocy sensor is unknown.");

        var chores = this.entity.attributes.chores;
        var allChores = []
  
        if(chores != null){
          chores.sort(function(a,b){
            if (a.next_estimated_execution_time != null && b.next_estimated_execution_time != null) {
              var aSplitDate = a.next_estimated_execution_time.split(/[- :T]/)
              var bSplitDate = b.next_estimated_execution_time.split(/[- :T]/)
    
              var aParsedDueDate = new Date(aSplitDate[0], aSplitDate[1]-1, aSplitDate[2]);
              var bParsedDueDate = new Date(bSplitDate[0], bSplitDate[1]-1, bSplitDate[2]);
    
              return aParsedDueDate - bParsedDueDate;
            }
              return;
          })
  
          if (this.filter != null) {
            var filteredChores = [];
            for (let i = 0; i < chores.length; i++) {
              if (chores[i].name.includes(this.filter)) {
                if (this.remove_filter) {
                  chores[i]._filtered_name = chores[i].name.replace(this.filter, '');
                  // console.log(chores[i]._filtered_name)
                }
                filteredChores.push(chores[i]);
              }
            }
            chores = filteredChores;
          }
  
          if (this.filter_user != null) {
            var filteredChores = [];
            for (let i = 0; i < chores.length; i++) {
              if (chores[i].next_execution_assigned_user != null && chores[i].next_execution_assigned_user.id == this.filter_user) {
                filteredChores.push(chores[i]);
              }
            }
            chores = filteredChores;
          }
  
          chores.map(chore =>{
            var dueInDays = chore.next_estimated_execution_time ? this.calculateDueDate(chore.next_estimated_execution_time) : 10000;
            chore.dueInDays = dueInDays;
            if(this.show_days !== null) {
              if(dueInDays <= this.show_days){
                allChores.push(chore);
              }
              else if(chore.next_estimated_execution_time != null && chore.next_estimated_execution_time.slice(0,4) == "2999") {
                chore.next_estimated_execution_time = "-";
                allChores.unshift(chore)
              }
            }
            else {
              if(chore.next_estimated_execution_time == null || dueInDays == 10000 || chore.next_estimated_execution_time.slice(0,4) == "2999"){
                chore.next_estimated_execution_time = "-";
                allChores.unshift(chore)
              }
              else
                allChores.push(chore);
            }
          })
          
          if(this.show_quantity != null){
            this.chores = allChores.slice(0, this.show_quantity);
            this.notShowing = allChores.slice(this.show_quantity);
          }
          else{
            this.chores = allChores;
            this.notShowing = 0;
          }
        }
        else
          this.chores = allChores;
        
        this.state = this.entity.state
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

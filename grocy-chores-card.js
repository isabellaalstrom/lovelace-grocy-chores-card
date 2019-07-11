customElements.whenDefined('card-tools').then(() => {
  let cardTools = customElements.get('card-tools');
    
  class GrocyChoresCard extends cardTools.LitElement {
    
    setConfig(config) {
      if (!config.entity) {
        throw new Error('Please define entity');
      }
      this.config = config;
    }
    
    calculateDueDate(dueDate){
      var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
      var firstDate = new Date();
      var secondDate = new Date(dueDate);
      
      var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
      return diffDays;
    }

    checkDueClass(dueDate) {
      var diffDays = this.calculateDueDate(dueDate);
      if (diffDays == 0)
        return "due-today";
      else if (diffDays < 0)
        return "due";
      else
        return "not-due";
    }

    formatDueDate(dueDate) {
      var diffDays = this.calculateDueDate(dueDate);
      if (diffDays == 0)
        return "Today";
      else if (diffDays == 1)
        return "Tomorrow";
      else if (diffDays == 2)
        return "In 2 days";
      else if (diffDays == 3)
        return "In 3 days";
      else if (diffDays == 4)
        return "In 4 days";
      else if (diffDays == 5)
        return "In 5 days";
      else if (diffDays == 6)
        return "In 6 days";
      else if (diffDays >= 7 && diffDays <= 13)
        return "Next week";
      else if (diffDays >= 14 && diffDays <= 20)
        return "In two weeks";
      else if (diffDays >= 21 && diffDays <= 28)
        return "In three weeks";
      else if (diffDays >= 29 && diffDays <= 60)
        return "Next month";
      else
        return dueDate.substr(0, 10);
    }

    render(){
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
                    ${chore._name}
                    <div class="secondary ${chore._next_estimated_execution_time != null ? this.checkDueClass(chore._next_estimated_execution_time) : ""}">
                      Scheduled for: ${chore._next_estimated_execution_time != null ? this.formatDueDate(chore._next_estimated_execution_time) : "-"}
                    </div>
                    <div class="secondary">Last tracked: ${chore._last_tracked_time != null ? chore._last_tracked_time.substr(0, 10) : "-"} </div>
                  </div>
                  <div>
                    <mwc-button @click=${ev => this._track(chore._chore_id)}>Track</mwc-button>
                  </div>
                </div>

                `
              )}` : cardTools.LitHtml`<div class="info flex">No chores!</div>`}
            </div>
            ${this.notShowing.length > 0 ? cardTools.LitHtml`<div class="secondary">Look in Grocy for ${this.notShowing.length} more chores...</div>`
            : ""}
          </ha-card>`}
      `;
    }    
    _track(choreId){
      this._hass.callService("grocy", "execute_chore", {
        chore_id: choreId,
        tracked_time: new Date(),
        done_by: 2
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
            .due {
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
  
      const entity = hass.states[this.config.entity];
      this.header = this.config.title == null ? "Chores" : this.config.title;

      this.show_quantity = this.config.show_quantity == null ? null : this.config.show_quantity;
      this.show_days = this.config.show_days == null ? null : this.config.show_days;

      var chores = JSON.parse(entity.attributes.chores);
      var allChores = []

      if(chores != null){
        chores.sort(function(a,b){
          return new Date(a._next_estimated_execution_time) - new Date(b._next_estimated_execution_time);
        })

        chores.map(chore =>{
          if(this.show_days != null) {
            var diffDays = this.calculateDueDate(chore._next_estimated_execution_time);
            if(diffDays < this.show_days){
              allChores.push(chore);
            }
            else if(chore._next_estimated_execution_time != null && chore._next_estimated_execution_time.slice(0,4) == "2999") {
              chore._next_estimated_execution_time = "Whenever";
              allChores.unshift(chore)
            }
          }
          else {
            if(chore._next_estimated_execution_time != null && chore._next_estimated_execution_time.slice(0,4) == "2999"){
              chore._next_estimated_execution_time = "Whenever";
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
      
      this.state = entity.state
      this.requestUpdate();
    }
    

  
      // @TODO: This requires more intelligent logic
    getCardSize() {
      return 3;
    }
  }
  
  customElements.define('grocy-chores-card', GrocyChoresCard);
  });
  
  window.setTimeout(() => {
    if(customElements.get('card-tools')) return;
    customElements.define('grocy-chores-card', class extends HTMLElement{
      setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
    });
  }, 2000);
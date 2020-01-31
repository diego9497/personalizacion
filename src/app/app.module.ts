import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { PersonalizationModule } from "./shared/components/personalization/personalization.module";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, PersonalizationModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

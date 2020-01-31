import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PersonalizationComponent } from "./personalization.component";
import { SelectionModule } from "./selection/selection.module";
import { BoardModule } from "./board/board.module";

@NgModule({
  declarations: [PersonalizationComponent],
  imports: [CommonModule, SelectionModule, BoardModule],
  exports: [PersonalizationComponent]
})
export class PersonalizationModule {}

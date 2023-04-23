import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderModule } from 'angular-image-slider';
import { SwiperModule } from 'swiper/angular';
import { RouterModule } from '@angular/router';

import { ImgComponent } from './components/img/img.component';
import { ProductComponent } from './components/product/product.component';
import { ProductsComponent } from './components/products/products.component';
import { ReversePipe } from './pipes/reverse.pipe';
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { RemplacePipe } from './pipes/remplace.pipe';
import { HighlightDirective } from './directives/highlight.directive';

@NgModule({
    declarations: [
        ImgComponent,
        ProductComponent,
        ProductsComponent,
        ReversePipe,
        TimeAgoPipe,
        RemplacePipe,
        HighlightDirective
    ],
    imports: [CommonModule, SliderModule, SwiperModule, RouterModule],
    exports: [
        ImgComponent,
        ProductComponent,
        ProductsComponent,
        ReversePipe,
        TimeAgoPipe,
        RemplacePipe,
        HighlightDirective
    ]
})
export class SharedModule {}

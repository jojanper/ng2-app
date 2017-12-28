import { ComponentFactoryResolver, Injector, Type } from '@angular/core';


export function getComponentHtml(resolver: ComponentFactoryResolver, injector: Injector,
    component: Type<any>, data: any): string {

    const factory = resolver.resolveComponentFactory(component);
    const componentRef = factory.create(injector);

    componentRef.instance.setDynamicData(data);
    componentRef.changeDetectorRef.detectChanges();

    return componentRef.location.nativeElement.innerHTML;
}

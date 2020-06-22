import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterceptLayersComponent } from './intercept-layers.component';

describe('InterceptLayersComponent', () => {
  let component: InterceptLayersComponent;
  let fixture: ComponentFixture<InterceptLayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterceptLayersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterceptLayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

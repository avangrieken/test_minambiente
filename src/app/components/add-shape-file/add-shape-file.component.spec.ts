import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddShapeFileComponent } from './add-shape-file.component';

describe('AddShapeFileComponent', () => {
  let component: AddShapeFileComponent;
  let fixture: ComponentFixture<AddShapeFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddShapeFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddShapeFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

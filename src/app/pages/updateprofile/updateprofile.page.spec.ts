import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateprofilePage } from './updateprofile.page';

describe('UpdateprofilePage', () => {
  let component: UpdateprofilePage;
  let fixture: ComponentFixture<UpdateprofilePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateprofilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

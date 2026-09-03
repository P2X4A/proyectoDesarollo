import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Categoriascomponent } from './categoriascomponent';

describe('Categoriascomponent', () => {
  let component: Categoriascomponent;
  let fixture: ComponentFixture<Categoriascomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Categoriascomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Categoriascomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

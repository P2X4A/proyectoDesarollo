import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Carritocomponent } from './carritocomponent';

describe('Carritocomponent', () => {
  let component: Carritocomponent;
  let fixture: ComponentFixture<Carritocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Carritocomponent],
      imports: [FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Carritocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

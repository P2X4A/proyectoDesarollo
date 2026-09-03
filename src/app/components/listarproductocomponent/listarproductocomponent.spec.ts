import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Listarproductocomponent } from './listarproductocomponent';

describe('Listarproductocomponent', () => {
  let component: Listarproductocomponent;
  let fixture: ComponentFixture<Listarproductocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Listarproductocomponent],
    }).compileComponents();

    fixture = TestBed.createComponent(Listarproductocomponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter, RouterModule } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { Listarproductocomponent } from './listarproductocomponent';

describe('Listarproductocomponent', () => {
  let component: Listarproductocomponent;
  let fixture: ComponentFixture<Listarproductocomponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, RouterModule],
      providers: [provideRouter([]), provideHttpClient()],
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

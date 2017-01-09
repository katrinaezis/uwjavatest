package com.tedneward.example;

import java.beans.*;
import java.util.*;
import org.junit.Test;
import static org.junit.Assert.*;

public class TestPerson {
  @Test
  public void exerciseTheBasics() {
    Person p = new Person();
    p.setAge(20);
    p.setName("Fird Birfle");
    p.setSalary(195750.22);
    
    assertEquals(20, p.getAge());
    assertEquals("Fird Birfle", p.getName());
    
    assertEquals(215325.242, p.calculateBonus(), 0.01);
    assertEquals("The Honorable Fird Birfle", p.becomeJudge());
    assertEquals(30, p.timeWarp());
  }
  
  @Test(expected=IllegalArgumentException.class)
  public void setAgeToBeNegative() {
    Person p = new Person();
    p.setAge(-20);
  }
  
  @Test(expected=IllegalArgumentException.class)
  public void setNameToNull() {
    Person p = new Person();
    p.setName(null);
  }
  
  @Test
  public void viewReadabletoString() {
    Person p = new Person();
    p.setAge(20);
    p.setName("Fird Birfle");
    p.setSalary(195750.22);
    
    assertEquals("[Person name:Fird Birfle age:20 salary:195750.22]", p.toString());
  }
  
  @Test
  public void exercisePesonEquals() {
    Person p1 = new Person("Ted", 43, 250000);
    Person p2 = p1;
    assertEquals(p1, p2);
    
    Person p3 = new Person("Ted", 43, 250000);
    assertEquals(p1, p3);
    
    Person p4 = new Person("Ted", 43, 500000);
    assertEquals(p1, p4);
    
    Person p5 = new Person("Ted", 45, 250000);
    assertFalse(p1.equals(p5));
    
    Person p6 = new Person();
    assertFalse(p1.equals(p6));
    
    assertFalse(p1.equals(null));
    assertFalse(p1.equals(new Integer(27)));
  }

  @Test
  public void useAgeComparator() {
    List<Person> people = Person.getNewardFamily();
    Collections.sort(people, new Person.AgeComparator());
    
    assertEquals(new Person("Matthew", 15, 0), people.get(0));
    assertEquals(new Person("Michael", 22, 10000), people.get(1));
    assertEquals(new Person("Ted", 41, 250000), people.get(2));
    assertEquals(new Person("Charlotte", 43, 150000), people.get(3));
  }

  @Test
  public void useNaturalComparison() {
    List<Person> people = Person.getNewardFamily();
    Collections.sort(people);
    
    assertEquals(new Person("Ted", 41, 250000), people.get(0));
    assertEquals(new Person("Charlotte", 43, 150000), people.get(1));
    assertEquals(new Person("Michael", 22, 10000), people.get(2));
    assertEquals(new Person("Matthew", 15, 0), people.get(3));
  }
  
  @Test
  public void catchPropertyChange() {
    Person ted = new Person("Ted", 43, 250000);
    PropertyChangeListener pc1 = new PropertyChangeListener() {
      @Override
      public void propertyChange(PropertyChangeEvent pce) {
        assertEquals("ssn", pce.getPropertyName());
        assertEquals("", pce.getOldValue());
        assertEquals("012-34-5678", pce.getNewValue());
      }
    };
  }
}

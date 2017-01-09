package com.tedneward.example;

import java.beans.*;
import java.util.*;

public class Person implements Comparable<Person> {
  private int age;
  private String name;
  private double salary;
  private String ssn;
  private boolean propertyChangeFired = false;
  private int counter = 0;
  
  public Person() {
    this("", 0, 0.0d);
  }
  
  public Person(String n, int a, double s) {
    name = n;
    age = a;
    salary = s;
    this.counter++;
  }

  public int getAge() {
    return age;
  }

  public String getName() {
    return name;
  }

  public double getSalary() {
    return salary;
  }

  public String getSSN() {
    return ssn;
  }

  public void setSSN(String value) {
    String old = ssn;
    ssn = value;
    
    this.pcs.firePropertyChange("ssn", old, value);
    propertyChangeFired = true;
  }

  public void setAge(int age) {
    if (age < 0) {
      throw new IllegalArgumentException("Age is less than zero");
    }
    this.age = age;
  }

  public boolean getPropertyChangeFired() {
    return propertyChangeFired;
  }

  public void setName(String name) {
    if (name == null) {
      throw new IllegalArgumentException("Name can't be null");
    }
    this.name = name;
  }

  public void setSalary(double salary) {
    this.salary = salary;
  }

  public double calculateBonus() {
    return salary * 1.10;
  }
  
  public String becomeJudge() {
    return "The Honorable " + name;
  }
  
  public int timeWarp() {
    return age + 10;
  }

  public int count() {
    return counter;
  }

  @Override
  public boolean equals(Object obj) {
    if (obj instanceof Person) {
      Person p = (Person)obj;
      return (this.name.equals(p.name) && this.age == p.age);
    }
    return false;
  }

  @Override
  public int compareTo(Person other) {
    if(getSalary() < other.getSalary()) {
      return 1;
    } else if (getSalary() > other.getSalary()) {
      return -1;
    } else {
      return 0;
    }
  }

  @Override 
  public String toString() {
    return "[Person name:" + getName() + " age:" + getAge() + " salary:" + getSalary() + "]";
  }

  public static class AgeComparator implements Comparator<Person> {
    public int compare(Person p1, Person p2) {
      return p1.age - p2.age;
    }
  }

  public static ArrayList<Person> getNewardFamily(){
    ArrayList<Person> NewFam = new ArrayList<Person>();
    NewFam.add(new Person("Ted", 41, 250000.0));
    NewFam.add(new Person("Charlotte", 43, 150000.0));
    NewFam.add(new Person("Michael", 22, 10000.0));
    NewFam.add(new Person("Matthew", 15, 0.0));
    return NewFam;
  }

  // PropertyChangeListener support; you shouldn't need to change any of
  // these two methods or the field
  //
  private final PropertyChangeSupport pcs = new PropertyChangeSupport(this);
  public void addPropertyChangeListener(PropertyChangeListener listener) {
      this.pcs.addPropertyChangeListener(listener);
  }
  public void removePropertyChangeListener(PropertyChangeListener listener) {
      this.pcs.removePropertyChangeListener(listener);
  }
}

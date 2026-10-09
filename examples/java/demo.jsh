import com.google.gson.*;

Gson gson = new GsonBuilder().setPrettyPrinting().create();

class Planet {
    String name;
    double massEarths;
    int moons;
    Planet() {}
    Planet(String name, double massEarths, int moons) { this.name = name; this.massEarths = massEarths; this.moons = moons; }
    public String toString() { return name + " (" + massEarths + " Earth masses, " + moons + " moons)"; }
}

System.out.print(new String(java.nio.file.Files.readAllBytes(java.nio.file.Path.of("/root/banner.txt"))));

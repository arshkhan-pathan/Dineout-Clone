from django.db import models

# Create your models here.


class Tags(models.Model):
    name = models.CharField(max_length=200)
    image = models.CharField(max_length=200, blank=True,
                             default="https://im1.dineout.co.in/images/uploads/misc/2019/Jul/1/7.png")

    def __str__(self):
        return self.name


class Types(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name


class Cuisines(models.Model):
    name = models.CharField(max_length=200)

    def __str__(self):
        return self.name

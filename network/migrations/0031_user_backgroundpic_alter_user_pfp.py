# Generated by Django 4.2.2 on 2024-02-06 16:43

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0030_remove_post_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='backgroundpic',
            field=models.TextField(default='https://t3.ftcdn.net/jpg/01/34/31/72/360_F_134317274_PTXPn7EjliaYrJrZmfs0x5jFv8dmXsYn.jpg'),
        ),
        migrations.AlterField(
            model_name='user',
            name='pfp',
            field=models.TextField(default='https://as1.ftcdn.net/v2/jpg/05/16/27/58/1000_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'),
        ),
    ]

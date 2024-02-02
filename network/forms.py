from django import forms

class PostForm(forms.Form):
    content = forms.CharField(max_length=280, widget=forms.Textarea)

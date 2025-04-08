from django.test import TestCase
from django.urls import reverse

# Create your tests here.
class RegisterUserViewTest(TestCase):
    def test_register_user_post(self):
        url = reverse('register')  # Assuming the view is named 'register' in your urls.py
        data = {
            "caseid": "bpk31",
            "email": "bpk31@case.edu",
            "first_name": "Bhavya",
            "last_name": "Krishna",
            "age": 21,
            "grade": 12,
            "major": "Computer Science",
            "bio": "hi this is a test!",
            "password": "password123",
            "username": "bpk31@case.edu"
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, 201)  # HTTP 201 means successful creation
        self.assertIn('user_id', response.data)

    def test_register_user_get(self):
        url = reverse('register')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {"message": "Send a POST request to register."})


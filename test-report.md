# Test Report

| Test ID | Feature              | Input                      | Expected Output                    | Result |
|---------|----------------------|----------------------------|------------------------------------|--------|
| T1      | View homepage         | GET `/`                    | Loads homepage                     | Pass   |
| T2      | View courses          | GET `/courses`             | List of courses displayed          | Pass   |
| T3      | Course details        | GET `/course/:id`          | Shows course description/details   | Pass   |
| T4      | Enrol in course       | POST `/enrol`              | Displays confirmation              | Pass   |
| T5      | Admin login           | POST `/admin/login`        | Redirects to dashboard             | Pass   |
| T6      | Add course (admin)    | POST `/admin/add-course`   | Course added to dashboard          | Pass   |
| T7      | Delete course (admin) | POST `/admin/delete-course`| Course removed                     | Pass   |
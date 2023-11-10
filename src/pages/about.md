---
title: About
---

<div class="text-center">
  <h3>About</h3>
</div>

[AioFauna](https://github.com/antfu/aiofauna) is an opinionated Python backend framework made by [@obahamonde](https://github.com/aiofauna) for building backend applications swiftly. With **automatic Swagger UI docs**, **FastAPI-like syntax**, **FaunaModel ODM out of the box** uses **APIClient** for seamless integrations.

```python
from aiofauna import APIServer

app = APIServer()

@app.get("/")
async def hello():
    return {"message": "Hello World"}
```

Check out the [GitHub repo](https://github.com/obahamonde/aiofauna) for more details.

<route lang="yaml">
  meta:
    layout: 'home'
</route>

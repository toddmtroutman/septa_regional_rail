import logging
import requests
from homeassistant.helpers.entity import Entity
from homeassistant.const import CONF_NAME

_LOGGER = logging.getLogger(__name__)

SEPTA_API_URL = "https://www3.septa.org/api/Arrivals/index.php"

def setup_platform(hass, config, add_entities, discovery_info=None):
    """Set up the SEPTA Regional Rail sensor platform."""
    name = config.get(CONF_NAME, "SEPTA Regional Rail")
    station = "30th St"  # Change this to a configurable station if needed
    num_results = 5  # Number of results to show

    train_data = fetch_train_data(station, num_results)
    if train_data:
        add_entities([SEPTARegionalRailSensor(name, train_data)])

def fetch_train_data(station, num_results):
    """Fetch train data from SEPTA API."""
    try:
        url = f"{SEPTA_API_URL}?station={station}&results={num_results}"
        response = requests.get(url)
        response.raise_for_status()
        return response.json().get("*", [])
    except requests.exceptions.RequestException as e:
        _LOGGER.error("Error fetching SEPTA train data: %s", e)
        return None

class SEPTARegionalRailSensor(Entity):
    """Representation of a SEPTA Regional Rail sensor."""

    def __init__(self, name, train_data):
        """Initialize the sensor."""
        self._name = name
        self._train_data = train_data
        self._state = "Unknown"

    @property
    def name(self):
        """Return the name of the sensor."""
        return self._name

    @property
    def state(self):
        """Return the state of the sensor."""
        if self._train_data:
            return len(self._train_data)  # Or more detailed state, e.g., first train status
        return "No Data"

    @property
    def extra_state_attributes(self):
        """Return additional state attributes."""
        return {"train_data": self._train_data}


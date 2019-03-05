"""
Pylint plugin module
Fixes errors caused at lint-time by SQLAlchemy and using Flask Logger

"""

import sys

from astroid import MANAGER, scoped_nodes, extract_node
from astroid.builder import AstroidBuilder
from sqlalchemy.orm import Session


def register(_linter):
    """
    Implement register function for linter passthrough
    """
    pass

def transform(cls):
    """
    Class level transform to fix issues with SQL Alchemy and Linting
    """
    if cls.name == 'scoped_session':
        builder = AstroidBuilder(MANAGER)
        module_node = builder.module_build(sys.modules[Session.__module__])
        session_cls_node = [
            c for c in module_node.get_children()
            if getattr(c, "type", None) == "class" and c.name == Session.__name__
        ][0]

        for prop in Session.public_methods:
            cls.locals[prop] = [
                c for c in session_cls_node.get_children()
                if getattr(c, "type", None) == "method" and c.name == prop
            ]

def transform_func(func):
    """
    Class level transform to fix issues with Python logger and SQL Alchemy
    """
    if func.name == 'logger':
        for prop in ['debug', 'info', 'warning', 'error', 'addHandler']:
            func.instance_attrs[prop] = extract_node('def {name}(arg): return'.format(name=prop))

MANAGER.register_transform(scoped_nodes.ClassDef, transform)
MANAGER.register_transform(scoped_nodes.FunctionDef, transform_func)
